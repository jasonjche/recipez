<script lang="ts">
    export let items: string[];
</script>

<div class="bg-white rounded-lg shadow-lg p-6 mt-8">
    <h2 class="text-2xl font-bold mb-4">Grocery List</h2>
    <ul class="list-inside list-disc text-lg">
        {#each items as item}
            <li>{item}</li>
        {/each}
    </ul>
</div>