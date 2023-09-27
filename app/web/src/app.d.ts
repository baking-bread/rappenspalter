// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Products {
			id: number;
			name: string;
			price: number;
			description: string;
			image: string;
		}
	}
}

export {};