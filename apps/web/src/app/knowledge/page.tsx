import React from 'react';
import { redirect } from 'next/navigation';
import { getKnowledgeFeed } from '@api';
import { createClient } from '@/utils/supabase/server';
import type { Paper } from '@types-app';

export default async function KnowledgeFeed() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user!.id;
  const category = 'Artificial Intelligence';
  
  let papers: Paper[] = [];
  try {
    papers = (await getKnowledgeFeed(supabase, userId, category)) as unknown as Paper[];
  } catch (error) {
    console.error('Failed to fetch knowledge feed:', error);
  }

  return (
    <main className="max-w-[1280px] mx-auto p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-display-lg text-primary mb-2">The Knowledge Hub</h1>
        <p className="text-body-lg text-on-surface-variant">
          Curated research for your learning journey.
        </p>
      </header>

      <section>
        <h2 className="text-headline-md text-primary-container mb-6 flex items-center gap-2">
          {category} 
          <span className="text-label-md bg-surface-dim px-2 py-1 rounded-sm">New</span>
        </h2>
        
        {papers.length === 0 ? (
          <div className="p-8 border border-outline-variant rounded-lg text-center">
            <p className="text-on-surface-variant">No papers found for this topic yet. Check back after the pipeline runs!</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory">
            {papers.map((paper: Paper) => (
              <div 
                key={paper.id} 
                className="min-w-[300px] max-w-[320px] shrink-0 border border-outline-variant bg-surface rounded-lg p-6 flex flex-col snap-start shadow-sm hover:shadow-md transition-shadow relative"
              >
                {/* High relevance indicator */}
                {paper.citation_count > 100 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container rounded-t-lg" />
                )}
                
                <h3 className="text-headline-sm font-headline text-primary mb-3">
                  {paper.plain_title || paper.title}
                </h3>
                <p className="text-body-md text-on-surface mb-4 flex-grow line-clamp-4">
                  {paper.summary}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {paper.topic_tags?.map((tag: string) => (
                    <span key={tag} className="text-label-sm bg-primary/10 text-primary px-2 py-1 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-outline-variant">
                  <span className="text-label-sm text-outline">
                    {paper.citation_count} Citations
                  </span>
                  <button className="text-label-md text-primary-container hover:text-secondary bg-transparent border border-outline-variant px-4 py-2 rounded-sm transition-colors">
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
