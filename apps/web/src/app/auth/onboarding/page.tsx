"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const SKILLS = [
    'Code', 'Design', 'Writing', 'Research', 'Strategy', 'Analysis', 
    'Marketing', 'Sales', 'Finance', 'Legal', 'Product', 'Operations', 
    'Data', 'Video & Media', 'Community', 'Fundraising'
  ];

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else if (selectedSkills.length < 3) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleFinish = () => router.push('/knowledge');

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full bg-surface border border-outline-variant rounded-lg p-8 shadow-sm">
        
        {/* Step Indicators */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-2 rounded-full flex-1 ${i <= step ? 'bg-primary' : 'bg-surface-dim'}`}
            />
          ))}
        </div>

        {/* Step 1: Username */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-headline-lg text-primary font-headline mb-2 text-center">Claim your identity</h1>
            <p className="text-body-md text-on-surface-variant text-center mb-8">
              This is how other builders will know you.
            </p>
            
            <div className="space-y-4 mb-8">
              <label className="text-label-sm text-on-surface">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-outline">@</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded pl-10 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="builder123"
                />
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!username.trim()}
              className="w-full bg-primary text-on-primary py-3 rounded font-body font-medium hover:bg-primary-container disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-headline-lg text-primary font-headline mb-2 text-center">What do you build?</h1>
            <p className="text-body-md text-on-surface-variant text-center mb-8">
              Select up to 3 core skills to curate your feed.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {SKILLS.map(skill => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-4 py-2 rounded-sm text-label-md border transition-all ${
                      isSelected 
                        ? 'bg-secondary text-on-secondary border-secondary' 
                        : 'bg-surface border-outline-variant text-on-surface hover:border-primary'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleNext}
              disabled={selectedSkills.length === 0}
              className="w-full bg-primary text-on-primary py-3 rounded font-body font-medium hover:bg-primary-container disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: GitHub Connect */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-headline-lg text-primary font-headline mb-2 text-center">Connect GitHub</h1>
            <p className="text-body-md text-on-surface-variant text-center mb-8">
              Required to participate in code contribution tasks and build your Proof of Work.
            </p>

            <div className="bg-surface-dim rounded-lg p-6 flex flex-col items-center justify-center mb-8 border border-outline-variant">
              <svg className="w-16 h-16 text-on-surface mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <button className="bg-[#24292e] text-white px-6 py-2 rounded-sm font-medium hover:bg-[#2f363d] transition-colors w-full">
                Connect GitHub
              </button>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full bg-primary text-on-primary py-3 rounded font-body font-medium hover:bg-primary-container transition-colors mb-4"
            >
              Continue to Hub
            </button>
            
            <button 
              onClick={handleFinish}
              className="w-full text-center text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
