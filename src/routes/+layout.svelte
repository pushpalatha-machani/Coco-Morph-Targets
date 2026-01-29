<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

  onMount(() => {
    document.documentElement.classList.add('dark'); // enforce dark mode
  });

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="dark min-h-screen bg-background text-foreground">
	{@render children()}
</div>


