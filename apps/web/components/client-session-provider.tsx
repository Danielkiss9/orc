'use client';

import { SessionProvider } from 'next-auth/react';

export default function ClientSessionProvider({ children }: React.PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
