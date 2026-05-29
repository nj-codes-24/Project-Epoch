"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { getAnonSupabase, searchPapers, searchToolsFromGitHub } from '@api';
import type { Paper, Tool } from '@types-app';

interface GitHubTool {
  name: string;
  description: string;
  stars: number;
  forks: number;
  last_commit_at: string;
  html_url: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'papers' | 'tools'>('papers');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [tools, setTools] = useState<GitHubTool[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(false);
    
    try {
      const supabase = getAnonSupabase();
      
      // Perform both searches in parallel
      const [papersResult, toolsResult] = await Promise.all([
        searchPapers(supabase, query) as Promise<Paper[]>,
        searchToolsFromGitHub(query).catch(() => []) as Promise<GitHubTool[]>
      ]);
      
      setPapers(papersResult);
      setTools(toolsResult);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  return (
    <main className="max-w-[1280px] mx-auto p-6 md:p-12">
      <header className="mb-10">
        <Link href="/knowledge" className="text-secondary hover:underline mb-4 inline-block">
          &larr; Back to Hub
        </Link>
        <h1 className="text-headline-lg text-primary font-headline mb-6">Search</h1>
        
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, papers, or tools..."
            className="w-full bg-surface border-2 border-outline-variant rounded-full px-6 py-4 text-body-lg text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute right-3 top-3 bottom-3 bg-primary text-on-primary px-6 rounded-full font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant mb-8 max-w-2xl">
        <button
          onClick={() => setActiveTab('papers')}
          className={`px-6 py-3 text-label-md font-medium transition-colors border-b-2 ${
            activeTab === 'papers' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Research Papers ({hasSearched ? papers.length : 0})
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-6 py-3 text-label-md font-medium transition-colors border-b-2 ${
            activeTab === 'tools' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Open Source Tools ({hasSearched ? tools.length : 0})
        </button>
      </div>

      <section>
        {isSearching ? (
          <div className="py-12 text-center text-on-surface-variant">
            <p>Searching...</p>
          </div>
        ) : !hasSearched ? (
          <div className="py-12 text-center text-on-surface-variant max-w-2xl border border-outline-variant rounded-lg bg-surface-dim/30">
            <p>Enter a topic above to search our curated papers or find open-source tools from GitHub.</p>
          </div>
        ) : activeTab === 'papers' ? (
          papers.length === 0 ? (
            <div className="py-12 text-center max-w-2xl bg-surface border border-outline-variant rounded-lg p-8">
              <h3 className="text-headline-sm text-primary mb-2">No research papers found.</h3>
              <p className="text-on-surface-variant text-body-md">
                We don&apos;t have research papers on &quot;{query}&quot; yet. Our database updates daily via ArXiv and Semantic Scholar. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {papers.map(paper => (
                <div key={paper.id} className="bg-surface border border-outline-variant rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow">
                  <h3 className="text-headline-sm font-headline text-primary mb-2">{paper.plain_title || paper.title}</h3>
                  <p className="text-body-md text-on-surface mb-4 line-clamp-3">{paper.summary}</p>
                  <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between items-center">
                    <span className="text-label-sm text-outline">{paper.citation_count} Citations</span>
                    <button className="text-label-md text-primary-container hover:text-secondary font-medium">Save</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          tools.length === 0 ? (
            <div className="py-12 text-center max-w-2xl bg-surface border border-outline-variant rounded-lg p-8">
              <h3 className="text-headline-sm text-primary mb-2">No tools found.</h3>
              <p className="text-on-surface-variant text-body-md">
                We couldn&apos;t find any GitHub repositories matching &quot;{query}&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map(tool => (
                <div key={tool.html_url} className="bg-surface border border-outline-variant rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-headline-sm font-headline text-primary line-clamp-1">{tool.name}</h3>
                    <span className="text-label-sm bg-secondary-container text-on-secondary-container px-2 py-1 rounded-sm flex items-center gap-1">
                      ★ {tool.stars >= 1000 ? (tool.stars / 1000).toFixed(1) + 'k' : tool.stars}
                    </span>
                  </div>
                  <p className="text-body-md text-on-surface-variant mt-2 line-clamp-3">{tool.description}</p>
                  <div className="mt-auto pt-6 flex gap-3">
                    <a href={tool.html_url} target="_blank" rel="noreferrer" className="flex-1 bg-primary text-on-primary py-2 rounded-sm text-center text-label-md">View Repo</a>
                    <button className="flex-1 bg-surface-dim text-on-surface py-2 rounded-sm text-label-md hover:bg-outline-variant">Save Tool</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </section>
    </main>
  );
}
