<script lang="ts">
    import { EditIcon, ChevronLeftIcon, TrashIcon } from "svelte-feather-icons";
    import Button from "./Button.svelte";
    import { historyStore } from "../stores/history";
    import type { ChatType } from "../types";
    import { currentChatStore, emptyChat } from "../stores/messages";

    export let newChat: () => void;
    export let isCollapsed: boolean = false;

    let history: ChatType[];
    historyStore.subscribe((value) => (history = value));
    let currentChat: ChatType;
    currentChatStore.subscribe((value) => (currentChat = value));

    $: console.log("history", history);

    function removeChat(chat: ChatType) {
        historyStore.update(history => history.filter(c => c.id !== chat.id))
        localStorage.setItem("history", JSON.stringify(history));
    }

    let hoverToggleButton: boolean;
</script>

<div class="container" style="width: {isCollapsed ? '0' : '15vw'}">
    <div class="wrapper" style="opacity: {hoverToggleButton ? '.6' : '1'};">
        <header>
            <Button grow onClick={newChat} py={0.8}
                >New chat <EditIcon size="18" /></Button
            >
        </header>
        {#each history as chat}
            <Button
                onClick={() => {
                    newChat();
                    currentChatStore.set(chat);
                }}
                class={chat.id === currentChat.id ? "active" : ""}
                py={0.6}
            >
                {chat.name}

                <div slot="on-hover">
                    <Button square xy={.2} bg onClick={() => removeChat(chat)}>
                        <TrashIcon size="18" />
                    </Button>
                </div>
            </Button>
        {/each}
    </div>

    <button
        class="toggle"
        on:mouseenter={() => (hoverToggleButton = !hoverToggleButton)}
        on:mouseleave={() => (hoverToggleButton = !hoverToggleButton)}
        style="transform: translate(150%, -50%) rotate({isCollapsed
            ? '180deg'
            : '0'});"
        on:click={() => (isCollapsed = !isCollapsed)}
    >
        <ChevronLeftIcon />
    </button>
</div>

<style lang="scss">
    .container {
        width: 15vw;
        position: relative;

        background: rgb(0 0 0);
        z-index: 1;

        transition: width 0.3s ease;
    }

    .wrapper {
        height: auto;
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 1rem 0.5rem 1rem 0.5rem;

        display: flex;
        flex-direction: column;

        transition: opacity 0.2s;

        :global(> button) {
            white-space: nowrap;
            overflow: hidden;
            position: relative;

            &::after {
                content: "";
                width: 20%;
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
                background: linear-gradient(90deg, transparent 0%, rgb(0, 0, 0) 100%);
            }
        }
    }

    :global(.active) {
        background: rgb(var(--color-surface-900));
    }

    .toggle {
        right: 0;
        top: 50%;
        position: absolute;
        opacity: 0.6;

        transition: transform 0.2s ease;

        &:hover {
            opacity: 1;
        }
    }

    header {
        width: 100%;
        margin-bottom: 1rem;
        position: sticky;
        top: 0;
    }
</style>
