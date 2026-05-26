import { logger, schedules } from '@trigger.dev/sdk/v3';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

async function getGithubRepoInfo(githubUrl: string) {
  const token = process.env.GITHUB_API_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Knowledge-Hub-App'
  };
  if (token) headers['Authorization'] = `token ${token}`;

  // Extract owner and repo from URL
  const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  const owner = match[1];
  const repo = match[2];

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!res.ok) return null;
  return await res.json();
}

async function extractTags(title: string, abstract: string) {
  const prompt = `
Extract 3 to 5 lowercase topic keywords for this research paper.
Title: ${title}
Abstract: ${abstract}

Return exactly this JSON:
{
  "topic_tags": ["tag1", "tag2"]
}`;
  try {
    const result = await model.generateContent([{ text: prompt }]);
    const parsed = JSON.parse(result.response.text());
    return parsed.topic_tags || [];
  } catch (err) {
    logger.error("Failed to extract tags", { err });
    return [];
  }
}

export const monthlyDbRefresh = schedules.task({
  id: "monthly-db-refresh",
  cron: "0 3 1 * *", // 1st of every month at 03:00 UTC
  run: async () => {
    logger.info("Starting Monthly DB Refresh...");

    // 1. Tool version check
    logger.info("Step 1: Refreshing Tools...");
    const { data: activeTools } = await supabase.from('tools').select('*').eq('is_deprecated', false);
    for (const tool of activeTools || []) {
      try {
        const repoInfo = await getGithubRepoInfo(tool.github_url);
        if (!repoInfo) continue;

        const lastCommitAt = new Date(repoInfo.updated_at || repoInfo.pushed_at);
        const now = new Date();
        const diffMonths = (now.getTime() - lastCommitAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        await supabase.from('tools').update({
          stars: repoInfo.stargazers_count,
          forks: repoInfo.forks_count,
          last_commit_at: lastCommitAt.toISOString(),
          is_deprecated: diffMonths > 12
        }).eq('id', tool.id);
      } catch (err: any) {
        logger.error(`Error updating tool ${tool.github_url}`, { error: err.message });
      }
    }

    // 2. Paper citation refresh
    logger.info("Step 2: Refreshing Paper Citations...");
    const { data: activePapers } = await supabase.from('papers').select('*').eq('is_active', true).not('semantic_id', 'is', null);
    
    // Process in batches or simply iterate with rate limit
    for (const paper of activePapers || []) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 req/sec
        
        const headers: HeadersInit = {};
        if (process.env.SEMANTIC_SCHOLAR_API_KEY) {
          headers['x-api-key'] = process.env.SEMANTIC_SCHOLAR_API_KEY;
        }

        const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/CorpusId:${paper.semantic_id}?fields=citationCount,is_publisher_licensed`, { headers });
        if (res.ok) {
           const ssData = await res.json();
           
           // Simple update for citation count
           if (ssData.citationCount !== undefined) {
             await supabase.from('papers').update({ citation_count: ssData.citationCount }).eq('id', paper.id);
           }
           
           // Determining superseded status is complex via standard API without following graphs. 
           // For MVP, we will only update citations as requested by exact specs.
        }
      } catch (err: any) {
        logger.error(`Error updating paper ${paper.title}`, { error: err.message });
      }
    }

    // 3. Topic tag rebuild
    logger.info("Step 3: Rebuilding Topic Tags...");
    const { data: papersWithoutTags } = await supabase
      .from('papers')
      .select('*')
      .or('topic_tags.is.null,topic_tags.eq.{}')
      .eq('is_active', true);
      
    for (const paper of papersWithoutTags || []) {
      try {
        if (!paper.title || !paper.summary) continue;
        await new Promise(resolve => setTimeout(resolve, 6000)); // Gemini rate limit

        const tags = await extractTags(paper.title, paper.summary);
        if (tags.length > 0) {
          await supabase.from('papers').update({ topic_tags: tags }).eq('id', paper.id);
        }
      } catch (err: any) {
        logger.error(`Error tagging paper ${paper.title}`, { error: err.message });
      }
    }

    logger.info("Monthly DB Refresh finished.");
  }
});
