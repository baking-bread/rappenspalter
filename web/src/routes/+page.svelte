<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import type { PageData } from './$types';

	export let data: PageData;

	const products = writable();
	$: products.set(data);

	setContext('products', products);
</script>

<h1 class="text-3xl font-bold underline">{data.title}</h1>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
