<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	/** @type {import('$lib').Product[]} */
	export let data;

	const products = writable();
	$: products.set(data);

	setContext('products', products);
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
