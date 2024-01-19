<script lang="ts">
    export let data: {value: string, text: string}[];
    export let value: string;
</script>

<select bind:value name="" id="">
    {#each data as val}
        <option value={val.value}>{val.text}</option>
    {/each}
</select>

<style lang="scss">
    select {
        padding: .5rem 1rem;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;

        border-radius: var(--border-radius-1);
        border: 1px solid rgb(var(--color-surface-700));
        background: rgb(var(--color-surface-700));

        line-height: 1rem;
        font-size: inherit;
        cursor: pointer;

        transition: transform .2s ease;

        &:hover {
            background: rgb(var(--color-surface-950));
        }

        &:active {
            transform: scale(0.98);
        }
    }
</style>