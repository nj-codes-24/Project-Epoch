import { logger, schedules, wait } from '@trigger.dev/sdk/v3';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CATEGORIES = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Web Development', 
  'Mobile Development', 'Cybersecurity', 'Blockchain & Web3', 'Computer Vision', 
  'Natural Language Processing', 'Robotics & Hardware'
];

async function fetchSemanticScholar(category: string) {
  logger.info(`Fetching Semantic Scholar for ${category}`);
  // 1 req/sec rate limit guard
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const headers: HeadersInit = {};
  if (process.env.SEMANTIC_SCHOLAR_API_KEY) {
    headers['x-api-key'] = process.env.SEMANTIC_SCHOLAR_API_KEY;
  }
  
  // A simplistic mapping, ideally we map categories to SS fields of study
  const query = encodeURIComponent(category);
  const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&fields=title,abstract,year,citationCount,externalIds&limit=20`, { headers });
  
  if (!res.ok) throw new Error(`Semantic Scholar error: ${res.statusText}`);
  return await res.json();
}

async function fetchArXiv(category: string) {
  logger.info(`Fetching ArXiv for ${category}`);
  // 3 sec rate limit guard
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const query = encodeURIComponent(`all:"${category}"`);
  const res = await fetch(`http://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&max_results=20`);
  
  if (!res.ok) throw new Error(`ArXiv error: ${res.statusText}`);
  const text = await res.text();
  // Basic parsing for MVP (in production, use fast-xml-parser)
  const entries = text.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  return entries.map(entry => {
    const idMatch = entry.match(/<id>.*?\/abs\/(.*?)v\d+<\/id>/);
    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const abstractMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
    return {
      arxivId: idMatch?.[1],
      title: titleMatch?.[1]?.replace(/\n/g, ' ').trim(),
      abstract: abstractMatch?.[1]?.replace(/\n/g, ' ').trim()
    };
  });
}

async function summarizeWithGemini(title: string, abstract: string, retries = 3): Promise<any> {
  const prompt = `
Summarize this research paper for a student builder audience.
Title: ${title}
Abstract: ${abstract}

Return this exact JSON:
{
  "plain_title": "...",
  "summary": "...",
  "why_it_matters": "...",
  "topic_tags": ["...", "..."],
  "tools": [
    {
      "name": "...",
      "github_url": "https://github.com/...",
      "description": "..."
    }
  ]
}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // 10 req/min free tier guard - roughly 6 sec between calls
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
      const result = await model.generateContent([{ text: prompt }]);
      const jsonText = result.response.text();
      return JSON.parse(jsonText);
    } catch (err: any) {
      if (attempt === retries) throw err;
      const backoff = Math.pow(2, attempt) * 1000;
      logger.warn(`Gemini failed, retrying in ${backoff}ms...`, { error: err.message });
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
  }
}

async function validateGithubUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

export const dailyPaperPipeline = schedules.task({
  id: "daily-paper-pipeline",
  cron: "0 2 * * *", // Every day at 02:00 UTC
  run: async (payload, { ctx }) => {
    logger.info("Starting Daily Paper Pipeline...");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

    for (const category of CATEGORIES) {
      try {
        // Fetch raw data
        const [ssData, arxivData] = await Promise.all([
          fetchSemanticScholar(category).catch(err => { logger.error(err.message); return { data: [] }; }),
          fetchArXiv(category).catch(err => { logger.error(err.message); return []; })
        ]);

        // Deduplication structures
        const papersToProcess: any[] = [];
        const seenTitles = new Set<string>();

        // Pre-fetch existing ids from DB
        const { data: existingIds } = await supabase.from('papers').select('arxiv_id, semantic_id, title');
        const dbArxivIds = new Set(existingIds?.map(p => p.arxiv_id).filter(Boolean));
        const dbSemanticIds = new Set(existingIds?.map(p => p.semantic_id).filter(Boolean));
        
        // Process SS
        for (const item of ssData.data || []) {
          const sid = item.externalIds?.CorpusId?.toString();
          if (sid && !dbSemanticIds.has(sid) && !seenTitles.has(item.title)) {
            papersToProcess.push({ semantic_id: sid, title: item.title, abstract: item.abstract, category, citationCount: item.citationCount || 0 });
            seenTitles.add(item.title);
          }
        }

        // Process ArXiv
        for (const item of arxivData || []) {
          if (item.arxivId && item.title && !dbArxivIds.has(item.arxivId) && !seenTitles.has(item.title)) {
            papersToProcess.push({ arxiv_id: item.arxivId, title: item.title, abstract: item.abstract, category, citationCount: 0 });
            seenTitles.add(item.title);
          }
        }

        logger.info(`Found ${papersToProcess.length} new papers for ${category}`);

        for (const paper of papersToProcess) {
          try {
            if (!paper.abstract || !paper.title) continue;
            
            const aiData = await summarizeWithGemini(paper.title, paper.abstract);
            
            const { data: insertedPaper, error: insertError } = await supabase
              .from('papers')
              .insert({
                arxiv_id: paper.arxiv_id || null,
                semantic_id: paper.semantic_id || null,
                title: paper.title,
                plain_title: aiData.plain_title,
                summary: aiData.summary,
                why_it_matters: aiData.why_it_matters,
                category: paper.category,
                topic_tags: aiData.topic_tags,
                citation_count: paper.citationCount
              })
              .select('id')
              .single();
            
            if (insertError) {
              logger.error("DB Insert error", { error: insertError });
              continue;
            }

            // Process Tools
            for (const tool of aiData.tools || []) {
              if (!tool.github_url) continue;
              
              const isValid = await validateGithubUrl(tool.github_url);
              if (!isValid) {
                logger.warn(`Invalid GitHub URL skipped: ${tool.github_url}`);
                continue;
              }
              
              // Only insert if tool github_url does not exist
              const { error: toolErr } = await supabase
                .from('tools')
                .insert({
                  paper_id: insertedPaper.id,
                  github_url: tool.github_url,
                  name: tool.name,
                  description: tool.description
                });
                
              if (toolErr && toolErr.code !== '23505') { // 23505 is unique violation, which is fine
                 logger.error("Tool insert error", { error: toolErr });
              }
            }
          } catch (paperErr: any) {
             logger.error(`Failed to process paper: ${paper.title}`, { error: paperErr.message });
             // do not block pipeline
          }
        }

      } catch (catErr: any) {
        logger.error(`Failed to process category: ${category}`, { error: catErr.message });
      }
    }

    logger.info("Daily Paper Pipeline finished.");
  }
});
