<script lang="ts">
    export let grow: boolean = false;
    export let square: boolean = false;
</script>

<button
    style="width: {grow ? '100%' : 'auto'}; padding: .5rem {square
        ? '.5rem'
        : '1rem'};"
    class={$$restProps.class}
    on:click={$$restProps.onClick}
>
    <slot />
</button>

<style lang="scss">
    button {
        padding: 0.5rem 1rem;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;

        border-radius: var(--border-radius-1);

        line-height: 1rem;

        transition:
            transform 0.2s ease,
            background 0.2s ease;

        &:hover {
            background: rgb(var(--color-surface-950));
        }

        &:active {
            transform: scale(0.98);
        }
    }
</style>
