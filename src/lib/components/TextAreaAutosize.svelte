<script lang="ts">
    export let value: string = "";
    export let minRows = 0;
    export let maxRows: number;
    export let onSubmit: (value: string) => void;

    let textarea: HTMLTextAreaElement;

    $: lenght = value.length;

    $: minHeight = `${1 + minRows * 1.2}rem`;
    $: maxHeight = maxRows ? `${1 + maxRows * 1.2}rem` : "auto";

    function onKeydownHandler(e: KeyboardEvent) {
        // do nothing
        if (lenght === 0 && e.key === "Enter") {
            value = ""
            e.preventDefault()
        }

        // grow the text area
        else if (e.shiftKey && e.key === "Enter" && value != "") {
            // default behavior
        }

        // submit
        else if (e.key === "Enter" && value.length > 0) {
            onSubmit(value || "");
            value = ""
            e.preventDefault()
        }
    }
</script>

<div class="container">
    <pre
        aria-hidden="true"
        style="min-height: {minHeight}; max-height: {maxHeight}">{value + "\n"}</pre>
    <textarea
        bind:value={value}
        bind:this={textarea}
        on:keydown={onKeydownHandler}
        {...$$restProps}
    ></textarea>
</div>

<style lang="scss">
    .container {
        position: relative;
    }

    pre,
    textarea {
        font-family: inherit;
        padding: 0.5em;
        box-sizing: border-box;
        border: 1px solid #eee;
        line-height: 1.2;
        overflow: hidden;

        min-width: 500px;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-1);
        border: 1px solid rgb(var(--color-surface-600));
        background: rgb(var(--color-surface-900));

        transition: max-height .2s ease;
    }

    pre {
    }

    textarea {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        resize: none;
    }
</style>
