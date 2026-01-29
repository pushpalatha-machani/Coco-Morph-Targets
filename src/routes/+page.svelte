<script lang="ts">
  /**
   * @fileoverview Face movement controller.
   */
  import { onMount } from 'svelte';
  import { Canvas } from '@threlte/core';
  // Component Imports
  import { Label } from '$lib/components/ui/label';
  import { Slider } from '$lib/components/ui/slider';
  import * as Card from "$lib/components/ui/card/index.js";
  import Scene from '$lib/components/Scene.svelte';
  // TRPC,state,derived Imports
  import { trpc } from '$lib/trpc';
  import { state, derived } from '$lib/state';

  interface Category {
    label: string;
    items: string[];
  }

  const MOVEMENT_CATEGORIES: Category[] = [
    { label: 'BeZier Curve Left',
      items: [ 'cbrow.center.up.L','cbrow.center.down.L','cbrow_inner_UP.L','cbrow_inner_down.L',],
    },
    { label: 'BeZier Curve Right',
      items: [ 'cbrow.center.up.R','cbrow.center.down.R','cbrow_inner_UP.R','cbrow_inner_down.R',],
    },
    { label: 'EYES', items: ['eye-blink.UP.L', 'eye-blink.UP.R'], },
    { label: 'LIPS', items: ['lips-smile.L', 'lips-smile.R', 'lip-JAW.DN'], },
  ];

  // State initialization
  const playbackSpeed = state<number>(0);
  const faceSettings = state<Record<string, number>>(
    Object.fromEntries(
      [...MOVEMENT_CATEGORIES.flatMap((c) => c.items), 'brow_center_UP'].map(
        (id) => [id, 0]
      )
    )
  );

  /** Derived state*/
  const processedSettings = derived(faceSettings, ($fs) => ({...$fs}));

  /**
   * @param name The unique identifier for the movement.
   * @param value The array of numbers returned by the Shadcn Slider.
   */
  async function syncMovement(name: string, value: number[]): Promise<void> {
    const val = value[0];
    if (name === 'playbackSpeed') {
      playbackSpeed.set(val);
    } else {
      faceSettings.update((fs) => ({...fs, [name]: val}));
    }
    try {
      await trpc.saveBrowMovement.mutate({name, value: val});
    } catch (error) {
      console.error(`Failed to sync movement: ${name}`, error);
    }
  }

  onMount(async () => {
    try {
      const data = await trpc.getFaceSettings.query();
      if (data?.settings) {
        faceSettings.set({...$faceSettings, ...data.settings});
      }
      if (data?.playbackSpeed) {
        playbackSpeed.set(data.playbackSpeed);
      }
    } catch (error) {
      console.error('Failed to fetch initial face settings:', error);
    }
  });
</script>

<div class="flex h-screen w-full flex-col overflow-hidden bg-background p-4 gap-4 md:flex-row">
  <main class="relative flex-1 flex flex-col border-2 border-border bg-card rounded-xl overflow-hidden shadow-sm">
    <Canvas>
      <Scene
        faceSettings={$processedSettings}
        playbackSpeed={$playbackSpeed}
      />
    </Canvas>
  </main>

  <!-- Slider Sidebar -->
  <aside class="z-50 flex h-[45vh] w-full flex-col border-2 border-border bg-card md:h-full md:w-80 rounded-xl shadow-sm">
    <div class="border-b border-border p-4">
      <h2 class="text-center text-sm tracking-widest uppercase text-foreground">
        Coco Movements
      </h2>
    </div>

    <div class="custom-scroll flex-1 space-y-8 overflow-y-auto p-6">
      <!-- Animation Speed Section -->
      <section class="space-y-4">
        <div class="flex justify-between items-center">
          <Label class="text-[10px] uppercase tracking-tighter text-primary-500">Animation Speed</Label>
          <span class="font-mono text-[10px] text-muted-foreground">{$playbackSpeed.toFixed(2)}</span>
        </div>
        <Slider
          value={[$playbackSpeed]}
          max={1}
          step={0.01}
          onValueChange={(v) => syncMovement('playbackSpeed', v)}/>
      </section>

      <!-- Morph Targets Slider View -->
      <section class="space-y-4">
        <div class="flex justify-between items-center">
          <Label class="text-[10px] uppercase tracking-tighter text-cyan-400">Brows UP</Label>
          <span class="font-mono text-[10px] text-muted-foreground">{$faceSettings['brow_center_UP'].toFixed(2)}</span>
        </div>
        <Slider
          value={[$faceSettings['brow_center_UP']]}
          max={1}
          step={0.01}
          onValueChange={(v) => syncMovement('brow_center_UP', v)}/>
      </section>

      {#each MOVEMENT_CATEGORIES as category}
        <div class="space-y-6 pt-4">
          <h3 class="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 border-b border-border pb-1">
            {category.label}
          </h3>
          {#each category.items as id}
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <Label class="text-[10px] font-medium text-cyan-400/80">
                  {id.replace(/[-._]/g, ' ')}
                </Label>
                <span class="font-mono text-[10px] text-muted-foreground">{$faceSettings[id].toFixed(2)}</span>
              </div>
              <Slider
                value={[$faceSettings[id]]}
                max={1}
                step={0.01}
                onValueChange={(v) => syncMovement(id, v)}/>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </aside>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
  :global(body) { font-family: 'Roboto Mono', monospace; }
</style>