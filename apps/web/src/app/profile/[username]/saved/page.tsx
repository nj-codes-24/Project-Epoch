"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSavedPapers, getSavedTools } from '@api';
import { createClient } from '@/utils/supabase/client';
import type { Paper, Tool } from '@types-app';

export default function ProfileSavedPage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState<'papers' | 'tools'>('papers');
  const [savedPapers, setSavedPapers] = useState<Paper[]>([]);
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          window.location.href = '/auth/login';
          return;
        }

        const userId = user.id;

        const [papersResult, toolsResult] = await Promise.all([
          getSavedPapers(supabase, userId) as Promise<any>,
          getSavedTools(supabase, userId) as Promise<any>
        ]);
        
        setSavedPapers(papersResult as Paper[]);
        setSavedTools(toolsResult as Tool[]);
      } catch (error) {
        console.error("Failed to load saved items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <main className="max-w-[1280px] mx-auto p-6 md:p-12">
      <header className="mb-10 flex justify-between items-end border-b border-outline-variant pb-8">
        <div>
          <h1 className="text-headline-lg text-primary font-headline mb-2">{params.username}&apos;s Profile</h1>
          <p className="text-body-lg text-on-surface-variant">Proof of Work and Saved Resources</p>
        </div>
        <Link href="/knowledge" className="text-primary-container border border-outline-variant px-4 py-2 rounded hover:bg-surface-dim transition-colors">
          Back to Feed
        </Link>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant mb-8">
        <button
          onClick={() => setActiveTab('papers')}
          className={`px-6 py-3 text-label-md font-medium transition-colors border-b-2 ${
            activeTab === 'papers' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Saved Papers ({savedPapers.length})
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-6 py-3 text-label-md font-medium transition-colors border-b-2 ${
            activeTab === 'tools' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Saved Tools ({savedTools.length})
        </button>
      </div>

      <section>
        {isLoading ? (
          <div className="py-12 text-center text-on-surface-variant">
            <p>Loading saved items...</p>
          </div>
        ) : activeTab === 'papers' ? (
          savedPapers.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <p>No saved papers yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPapers.map(paper => (
                <div key={paper.id} className="bg-surface border border-outline-variant rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow">
                  <h3 className="text-headline-sm font-headline text-primary mb-2 line-clamp-2">{paper.plain_title || paper.title}</h3>
                  <p className="text-label-sm text-outline mt-auto pt-4">Saved resource</p>
                  
                  <div className="flex gap-3 mt-4 pt-4 border-t border-outline-variant">
                    <button className="flex-1 bg-primary text-on-primary py-2 rounded-sm text-label-md">Read</button>
                    <button className="flex-1 bg-surface-dim text-on-surface py-2 rounded-sm text-label-md hover:bg-outline-variant">Unsave</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          savedTools.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <p>No saved tools yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTools.map(tool => (
                <div key={tool.id} className="bg-surface border border-outline-variant rounded-lg p-6 flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-headline-sm font-headline text-primary line-clamp-1">{tool.name}</h3>
                    <span className="text-label-sm bg-secondary-container text-on-secondary-container px-2 py-1 rounded-sm flex items-center gap-1">
                      ★ {tool.stars}
                    </span>
                  </div>
                  <p className="text-body-md text-on-surface-variant mt-2 line-clamp-3">{tool.description}</p>
                  
                  <div className="flex gap-3 mt-auto pt-6">
                    <button className="flex-1 bg-primary text-on-primary py-2 rounded-sm text-label-md">View Repo</button>
                    <button className="flex-1 bg-surface-dim text-on-surface py-2 rounded-sm text-label-md hover:bg-outline-variant">Unsave</button>
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
