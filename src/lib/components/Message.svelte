<script lang="ts">
    import type {MessageType} from "../types";
    import {marked} from "marked";
    import {capitalize} from "../utils/helpers";

    export let message: MessageType;
</script>

<div class="message-container">
    <div class="avatar">
        {#if message.role === 'user'}
            <span>Y</span>
        {:else}
            <span>A</span>
        {/if}
    </div>

    <div class="content">
        <span>{capitalize(message.role)}</span>
        {@html marked(message.content)}
        <!-- <p>{message.content}</p> -->
    </div>
</div>

<style lang="scss">

    .message-container {
        display: grid;
        grid-template-columns: 2rem 1fr;
        align-items: flex-start;
        gap: .4rem;
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
        padding-top: .2rem;

        display: flex;
        flex-direction: column;
        gap: .4rem;

        span {
            height: 1.6rem;
            font-weight: 700;
        }

        p {
            text-wrap: wrap;
        }
    }

</style>