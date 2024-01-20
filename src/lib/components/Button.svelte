<script lang="ts">
    export let grow: boolean = false;
    export let square: boolean = false;
    export let py: number = 0.5;
    export let px: number = 1;
    export let bg: boolean = false;
</script>

<button
    style="
    width: {grow ? '100%' : 'auto'}; 
    padding: {py}rem {square ? py + 'rem' : px + 'rem'};
    --background: {bg ? 'rgb(var(--color-surface-800))' : 'auto'}"
    class={$$restProps.class}
    on:click={$$restProps.onClick}
>
    <slot />
    <div class="on-hover">
        <slot name="on-hover" />
    </div>
</button>

<style lang="scss">
    button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        background: var(--background);

        border-radius: var(--border-radius-1);

        line-height: 1rem;

        transition:
            transform 0.1s ease,
            background 0.1s ease;

        &:hover {
            background: rgb(var(--color-surface-950));

            .on-hover {
                opacity: 1;
            }
        }

        &:active {
            transform: scale(0.98);
        }

        .on-hover {
            position: absolute;
            right: 0;
            z-index: 1;
            opacity: 0;
        }
    }
</style>
