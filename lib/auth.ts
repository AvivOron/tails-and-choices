import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createServiceClient } from '@/lib/supabase';

export const authOptions: NextAuthOptions = {
  cookies: {
    sessionToken: { name: '__Secure-tales.session-token', options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true } },
    callbackUrl: { name: '__Secure-tales.callback-url', options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true } },
    csrfToken: { name: '__Host-tales.csrf-token', options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true } },
    pkceCodeVerifier: { name: '__Secure-tales.pkce.code_verifier', options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true } },
    state: { name: '__Secure-tales.state', options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true } },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.id && user.email) {
        const supabase = createServiceClient();
        await supabase
          .from('users')
          .upsert({ id: user.id, email: user.email }, { onConflict: 'id' });
      }
      return true;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as typeof session.user & { id: string }).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};
