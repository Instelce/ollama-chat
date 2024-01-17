<script lang="ts">
    export let data: string[];
    export let value: string;
</script>

<select bind:value name="" id="">
    {#each data as val}
        <option value={val}>{val}</option>
    {/each}
</select>

<style lang="scss">
    
</style>