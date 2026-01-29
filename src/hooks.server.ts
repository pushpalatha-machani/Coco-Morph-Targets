import { createTRPCHandle } from 'trpc-sveltekit';
import { appRouter } from '$lib/server/trpc/router';
import type { Handle } from '@sveltejs/kit';

// This handles any request that goes to /trpc
export const handle: Handle = createTRPCHandle({ 
    router: appRouter,
    url: '/trpc' 
});