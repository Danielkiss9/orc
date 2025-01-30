import NextAuth from 'next-auth';
import { authOptions } from '@orc/web/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
