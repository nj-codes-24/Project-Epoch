import React from 'react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full bg-surface border border-outline-variant rounded-lg p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-headline-lg text-primary font-headline mb-2">Join the Hub</h1>
          <p className="text-body-md text-on-surface-variant">Create an account to start your learning journey</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-label-sm text-on-surface" htmlFor="email">Email address</label>
            <input 
              id="email" 
              type="email" 
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
              placeholder="you@university.edu"
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-sm text-on-surface" htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Link 
            href="/auth/onboarding"
            className="block w-full text-center bg-primary text-on-primary py-3 rounded font-body font-medium hover:bg-primary-container transition-colors"
          >
            Create Account
          </Link>
        </form>

        <div className="mt-6 text-center text-body-sm text-on-surface-variant">
          Already have an account? <Link href="/auth/login" className="text-secondary hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
