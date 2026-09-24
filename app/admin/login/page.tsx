'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage('Invalid email or password. Please try again.');
        setLoading(false);
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage('Unable to connect to authentication server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EBF3FA] to-[#DCEBF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      {/* Back to Home Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy/70 hover:text-navy transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to SaveMart Storefront</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <span className="font-heading font-black text-3xl tracking-tight text-navy">
              SAVEMART
            </span>
            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-leaf-light text-leaf border border-leaf/20">
              DK
            </span>
          </div>
          <p className="text-xs uppercase tracking-widest font-bold text-sky-900/70">
            Supermarket Administration Portal
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white/90 backdrop-blur-md py-8 px-6 shadow-xl border border-sky-100 rounded-3xl sm:px-10">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sky-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-navy shadow-inner">
              <Lock className="w-5 h-5 text-sky-800" />
            </div>
            <div>
              <h2 className="text-lg font-black text-navy font-heading">Admin Sign In</h2>
              <p className="text-xs text-navy/60">Sign in to manage inventory & orders</p>
            </div>
          </div>

          {/* Inline Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center gap-2.5 text-rose-700 text-xs font-medium animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@savemart.dk"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/90 border border-sky-100 text-xs text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/90 border border-sky-100 text-xs text-navy placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy/40 hover:text-navy transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-navy hover:bg-navy-light text-white text-xs font-bold tracking-wider uppercase transition shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-sky-50 text-center">
            <p className="text-[11px] text-navy/50">
              Protected by NextAuth 8-hour encrypted session tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EBF3FA] to-[#DCEBF8] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-navy" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
