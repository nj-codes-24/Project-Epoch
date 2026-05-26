import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../supabase/types';

// For jobs/server-side strictly using service role
export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase Service Role credentials");
  return createClient<Database>(url, key);
}

// For UI client components / anon access
export function getAnonSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase Anon credentials");
  return createClient<Database>(url, key);
}

export const getKnowledgeFeed = async (supabase: SupabaseClient<Database>, userId: string, category: string) => {
  const { data: seenRefs } = await supabase
    .from('user_seen_papers')
    .select('paper_id')
    .eq('user_id', userId);
  
  const seenIds = new Set(seenRefs?.map(r => r.paper_id) || []);
  
  const { data: allPapers, error } = await supabase
    .from('papers')
    .select('*, tools(*)')
    .eq('category', category)
    .eq('is_active', true)
    .order('citation_count', { ascending: false })
    .order('processed_at', { ascending: false })
    .limit(30);

  if (error) throw error;
  if (!allPapers) return [];

  const unseen = allPapers.filter(p => !seenIds.has(p.id));
  
  if (unseen.length >= 5) {
    return unseen.slice(0, 5);
  }
  
  const seen = allPapers.filter(p => seenIds.has(p.id));
  const result = [...unseen, ...seen];
  return result.slice(0, 5);
};

export const markPaperSeen = async (supabase: SupabaseClient<Database>, userId: string, paperId: string) => {
  const { error } = await supabase
    .from('user_seen_papers')
    .upsert({ user_id: userId, paper_id: paperId }, { onConflict: 'user_id,paper_id' });
  if (error) throw error;
};

export const savePaper = async (supabase: SupabaseClient<Database>, userId: string, paperId: string) => {
  const { error } = await supabase
    .from('saved_papers')
    .upsert({ user_id: userId, paper_id: paperId }, { onConflict: 'user_id,paper_id' });
  if (error) throw error;
};

export const unsavePaper = async (supabase: SupabaseClient<Database>, userId: string, paperId: string) => {
  const { error } = await supabase
    .from('saved_papers')
    .delete()
    .eq('user_id', userId)
    .eq('paper_id', paperId);
  if (error) throw error;
};

export const saveTool = async (supabase: SupabaseClient<Database>, userId: string, toolId: string) => {
  const { error } = await supabase
    .from('saved_tools')
    .upsert({ user_id: userId, tool_id: toolId }, { onConflict: 'user_id,tool_id' });
  if (error) throw error;
};

export const unsaveTool = async (supabase: SupabaseClient<Database>, userId: string, toolId: string) => {
  const { error } = await supabase
    .from('saved_tools')
    .delete()
    .eq('user_id', userId)
    .eq('tool_id', toolId);
  if (error) throw error;
};

export const getSavedPapers = async (supabase: SupabaseClient<Database>, userId: string) => {
  const { data, error } = await supabase
    .from('saved_papers')
    .select('*, papers(*, tools(*))')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });
  if (error) throw error;
  return data?.map(d => d.papers).filter(Boolean) || [];
};

export const getSavedTools = async (supabase: SupabaseClient<Database>, userId: string) => {
  const { data, error } = await supabase
    .from('saved_tools')
    .select('*, tools(*)')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });
  if (error) throw error;
  return data?.map(d => d.tools).filter(Boolean) || [];
};

export const searchPapers = async (supabase: SupabaseClient<Database>, query: string) => {
  // Using ilike for simple text search (title + summary). In production, Postgres FTS is better, but this works for MVP.
  const { data, error } = await supabase
    .from('papers')
    .select('*, tools(*)')
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .eq('is_active', true)
    .limit(10);
  if (error) throw error;
  return data || [];
};

export const searchToolsFromGitHub = async (query: string) => {
  const token = process.env.GITHUB_API_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Knowledge-Hub-App'
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`, { headers });
  if (!res.ok) throw new Error(`GitHub search failed: ${res.statusText}`);
  const data = await res.json();
  
  return data.items.map((item: any) => ({
    name: item.full_name,
    description: item.description,
    stars: item.stargazers_count,
    forks: item.forks_count,
    last_commit_at: item.updated_at,
    html_url: item.html_url
  }));
};
