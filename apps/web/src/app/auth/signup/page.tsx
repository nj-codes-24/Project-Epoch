"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_name: email.split('@')[0],
          full_name: email.split('@')[0],
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    } else if (!data.session) {
      setSuccessMsg("Account created! Please check your email to confirm your account before logging in.");
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
          <h1 className="text-headline-lg text-primary font-headline mb-2">Join the Hub</h1>
          <p className="text-body-md text-on-surface-variant">Create an account to start your learning journey</p>
        </div>

        <form className="space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="bg-error/10 border border-error text-error p-3 rounded text-body-sm text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-primary/10 border border-primary text-primary p-4 rounded text-body-md text-center font-medium">
              {successMsg}
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
              minLength={6}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary py-3 rounded font-body font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-body-sm text-on-surface-variant">
          Already have an account? <Link href="/auth/login" className="text-secondary hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
