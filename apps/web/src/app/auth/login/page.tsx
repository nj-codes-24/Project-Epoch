"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('student1@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    } else {
      router.push('/knowledge');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full bg-surface border border-outline-variant rounded-lg p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-headline-lg text-primary font-headline mb-2">Welcome Back</h1>
          <p className="text-body-md text-on-surface-variant">Sign in to continue to The Knowledge Hub</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-error/10 border border-error text-error p-3 rounded text-body-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-label-sm text-on-surface" htmlFor="email">Email address</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
              placeholder="you@university.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-sm text-on-surface" htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary py-3 rounded font-body font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-body-sm text-on-surface-variant">
          Don&apos;t have an account? <Link href="/auth/signup" className="text-secondary hover:underline font-medium">Sign up</Link>
        </div>
      </div>
    </main>
  );
}
