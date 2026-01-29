import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { readFaceSettings, writeFaceSettings } from '../data/faceSettings.server';

const t = initTRPC.create();

export const appRouter = t.router({
  saveBrowMovement: t.procedure
    .input(z.object({ name: z.string(), value: z.number() }))
    .mutation(({ input }) => {
      const settings = readFaceSettings();
      settings[input.name] = input.value;
      writeFaceSettings(settings);
      console.log("Saved:", input);
      return { status: "success", settings };
    }),
  getFaceSettings: t.procedure.query(() => {
    return readFaceSettings();
  })
});

export type AppRouter = typeof appRouter;

