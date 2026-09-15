import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || 'postgresql://savemart_user:SaveMartProductionPassword2026!@localhost:5432/savemart_db';

let pool: Pool | null = null;
function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString });
  }
  return pool;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@savemart.dk' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        try {
          const client = await getPool().connect();
          try {
            const result = await client.query(
              'SELECT id, email, password_hash FROM admin_users WHERE LOWER(email) = $1 LIMIT 1',
              [normalizedEmail]
            );

            if (result.rows.length === 0) {
              return null;
            }

            const user = result.rows[0];
            const isValid = await bcrypt.compare(credentials.password, user.password_hash);

            if (!isValid) {
              return null;
            }

            return {
              id: user.id.toString(),
              email: user.email,
              name: 'Admin',
            };
          } finally {
            client.release();
          }
        } catch (error) {
          console.warn('NextAuth DB query fallback (PostgreSQL unavailable or disconnected):', (error as any)?.message || error);
          // Fallback support if DB connection fails or during local testing
          const fallbackEmail = (process.env.ADMIN_EMAIL || 'admin@savemart.dk').toLowerCase().trim();
          const fallbackPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';
          if (normalizedEmail === fallbackEmail && credentials.password === fallbackPass) {
            return {
              id: '1',
              email: fallbackEmail,
              name: 'Admin',
            };
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours of inactivity
  },
  jwt: {
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'savemart-secret-fallback-for-dev-only-change-in-prod-2026',
};
