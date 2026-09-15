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
            // Ensure admin_users table exists
            await client.query(`
              CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
              );
            `);

            let result = await client.query(
              'SELECT id, email, password_hash FROM admin_users WHERE LOWER(email) = $1 LIMIT 1',
              [normalizedEmail]
            );

            const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@savemart.dk').toLowerCase().trim();
            const defaultPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';

            if (result.rows.length === 0) {
              const countRes = await client.query('SELECT COUNT(*) as total FROM admin_users');
              const totalUsers = parseInt(countRes.rows[0].total, 10);

              if (totalUsers === 0 || normalizedEmail === defaultEmail) {
                if (credentials.password === defaultPass) {
                  // Auto-seed default admin into PostgreSQL
                  const hash = await bcrypt.hash(defaultPass, 10);
                  const insertRes = await client.query(
                    `INSERT INTO admin_users (email, password_hash)
                     VALUES ($1, $2)
                     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
                     RETURNING id, email;`,
                    [defaultEmail, hash]
                  );
                  return {
                    id: insertRes.rows[0].id.toString(),
                    email: insertRes.rows[0].email,
                    name: 'Admin',
                  };
                }
              }
              return null;
            }

            const user = result.rows[0];
            const isValid = await bcrypt.compare(credentials.password, user.password_hash);

            if (!isValid) {
              // If default admin password matches in env, auto-update password hash in DB
              if (normalizedEmail === defaultEmail && credentials.password === defaultPass) {
                const newHash = await bcrypt.hash(defaultPass, 10);
                await client.query(
                  'UPDATE admin_users SET password_hash = $1 WHERE id = $2',
                  [newHash, user.id]
                );
                return {
                  id: user.id.toString(),
                  email: user.email,
                  name: 'Admin',
                };
              }
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
