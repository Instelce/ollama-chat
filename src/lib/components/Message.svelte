<script lang="ts">
    import type { MessageType } from "../types";
    import { marked } from "marked";
    import markdownit from "markdown-it"
    import highlightjs from 'markdown-it-highlightjs';
    import { capitalize } from "../utils/helpers";

    export let message: MessageType;
    export let isLoading: boolean = false;

    const md = markdownit({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true,
        highlight: true
    }).use(highlightjs)

    $: htmlContent = md.render(message.content).replace(/#/g, '')
</script>

<div class="message-container">
    <div class="avatar">
        {#if message.role === "user"}
            <span>Y</span>
        {:else}
            <span>A</span>
        {/if}
    </div>

    <div class="content">
        <span>{capitalize(message.role)}</span>
        {@html htmlContent}
        {#if isLoading}
            <span class="cursor"></span>
        {/if}
    </div>
</div>

<style lang="scss">
    .message-container {
        display: grid;
        grid-template-columns: 2rem 1fr;
        align-items: flex-start;
        gap: 0.4rem;
    }

    .avatar {
        width: 1.6rem;
        height: 1.6rem;
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 100px;
        background: rgb(var(--color-surface-400));
    }

    .content {
        padding-top: 0.2rem;

        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        /* Style of markdown */
    }

    p {
        width: fit-content;
        text-wrap: wrap;
        display: inline-block;
    }

    .cursor {
        width: 0.8rem;
        height: 0.8rem;
        background: rgb(var(--color-surface-50));
        border-radius: 100px;
        animation: bounce 0.3s infinite;
        display: inline;
        background: rgb(var(--color-surface-50));
    }

    @keyframes bounce {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0.8);
        }
    }
</style>
