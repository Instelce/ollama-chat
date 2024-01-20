<script lang="ts">
    import type { MessageType } from "../types";
    import { marked } from "marked";
    import MarkdownIt from "markdown-it"
    import highlightjs from 'markdown-it-highlightjs';
    import { capitalize } from "../utils/helpers";

    export let message: MessageType;
    export let isLoading: boolean = false;

    const md = new MarkdownIt({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true,
        highlight: true
    }).use(highlightjs)

    $: htmlContent = md.render(message.content)
</script>

<div class="message-container">
    <div class="role">
        <div class="avatar">
            {#if message.role === "user"}
                <span>Y</span>
            {:else}
                <span>A</span>
            {/if}
        </div>
        
        <span>{capitalize(message.role)}</span>
    </div>

    <div class="content">
        <div class="md">
            {@html htmlContent}
        </div>
        {#if isLoading}
            <span class="cursor"></span>
        {/if}
    </div>
</div>

<style lang="scss">
    .message-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.4rem;
    }

    .role {
        display: flex;
        align-items: center;
        gap: 1rem;

        span {
            font-weight: 600;
        }
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
        margin-left: 2.6rem;
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
