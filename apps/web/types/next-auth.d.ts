import type { Role } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
