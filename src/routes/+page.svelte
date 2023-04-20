<script lang="ts">
	import GroceryList from '../lib/components/GroceryList.svelte';

	let recipeLinks: string[] = [];
	let groceryList: string[] = [];

	const handleLinkChange = (index: number, value: string) => {
		recipeLinks[index] = value;
	};

	const handleAddLink = () => {
		recipeLinks = [...recipeLinks, ''];
	};

	const handleRemoveLink = (index: number) => {
		recipeLinks = recipeLinks.filter((_, i) => i !== index);
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const response = await fetch('/api/ingredient-parse/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				recipeLinks: recipeLinks.filter((link) => link)
			})
		});
		const data = await response.json();
		groceryList = data;
	};

	const handleClear = () => {
		groceryList = [];
	};
</script>

<div class="min-h-screen bg-gray-100">
	<div class="max-w-screen-lg mx-auto px-6">
		<div class="py-12">
			<h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Recipe to Grocery List</h1>
			<form on:submit={handleSubmit} class="space-y-4">
				{#each recipeLinks as link, index}
					<div class="flex items-center space-x-2">
						<input
							type="text"
							bind:value={link}
							class="border border-gray-200 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-400"
							placeholder="Enter recipe URL"
						/>
						<button
							type="button"
							on:click={() => handleRemoveLink(index)}
							class="text-white bg-red-500 font-medium focus:outline-none hover:bg-red-700 rounded-md py-2 px-3"
						>
							Remove
						</button>
					</div>
				{/each}
				<button
					type="button"
					on:click={handleAddLink}
					class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full"
				>
					Add More
				</button>
				<button
					class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full"
					type="submit"
				>
					Generate Grocery List
				</button>
			</form>
		</div>
		{#if groceryList.length}
			<div class="py-4">
				<GroceryList items={groceryList} />
				<button
					class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-full mt-4"
					on:click={handleClear}
				>
					Clear Grocery List
				</button>
			</div>
		{/if}
	</div>
</div>
