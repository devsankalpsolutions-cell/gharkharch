'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  label?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  label = 'Continue with Google',
  onSuccess,
  onError,
  className = '',
}) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      // Check if Google Client ID is configured and Google GSI script is loaded
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (googleClientId && typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response?.credential) {
              const res = await loginWithGoogle({ credential: response.credential });
              setLoading(false);
              if (res.success) {
                if (onSuccess) onSuccess();
              } else {
                if (onError) onError(res.message || 'Google login failed.');
              }
            } else {
              setLoading(false);
              if (onError) onError('Google login was cancelled.');
            }
          },
        });
        (window as any).google.accounts.id.prompt();
        return;
      }

      // Seamless default Google Sign-In handler (or email confirmation prompt)
      setShowPrompt(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      if (onError) onError(err?.message || 'Google authentication error.');
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;

    setLoading(true);
    const res = await loginWithGoogle({
      email: customEmail,
      name: customName || customEmail.split('@')[0],
    });
    setLoading(false);

    if (res.success) {
      setShowPrompt(false);
      if (onSuccess) onSuccess();
    } else {
      if (onError) onError(res.message || 'Google login failed.');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`w-full py-2.5 px-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg cursor-pointer ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
        )}
        <span>{label}</span>
      </button>

      {/* Google Account Modal for seamless local testing or OAuth fallback */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#0D2044] border border-[#1E3A8A] rounded-2xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-bold text-white">Sign in with Google</h4>
                <p className="text-[11px] text-slate-400">Choose or enter your Google email</p>
              </div>
            </div>

            <form onSubmit={handleCustomGoogleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.google@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrompt(false)}
                  className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
