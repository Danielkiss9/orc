import { NextFetchEvent } from 'next/server';
import withAuth from './middlewares/auth';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default async function middleware(request: NextRequestWithAuth, event: NextFetchEvent) {
  const authResponse = await withAuth(request, event);
  if (authResponse) return authResponse;
  return null;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
