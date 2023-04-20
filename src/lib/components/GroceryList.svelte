<script lang="ts">
	export let items: string[];
</script>

<div class="bg-white rounded-lg shadow-lg p-6 mt-8">
	<h2 class="text-2xl font-bold mb-4">Grocery List</h2>
	<ul class="list-inside list-disc text-lg">
		{#each items as item}
			<div class="flex items-center">
				<input type="checkbox" id={item} class="form-checkbox h-5 w-5 text-green-600 rounded border-gray-300 mr-2" />
				<label for={item} class="text-lg">{item}</label>
			</div>
		{/each}
	</ul>
</div>
