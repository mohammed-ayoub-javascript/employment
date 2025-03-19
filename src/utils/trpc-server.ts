import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/trpc/routers/_app';

export const trpcServer = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc', 
    }),
  ],
});
