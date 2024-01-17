<script lang="ts">
    import { onMount } from "svelte";
    import ollamaAPI from "./lib/api";
    import chat from "./lib/chat";
    import Message from "./lib/components/Message.svelte";
    import Sidebar from "./lib/components/Sidebar.svelte";
    import TextAreaAutosize from "./lib/components/TextAreaAutosize.svelte";
    import { messagesStore, currentResponseStore } from "./lib/messages";
    import type { MessageType, Model } from "./lib/types";
    import { ArrowUpIcon } from "svelte-feather-icons";
    import Select from "./lib/components/Select.svelte";

    let messageValue: string;

    // Models
    let currentModel = "mistral";
    let allModels: Model[] = [];

    let messages: MessageType[] = [];
    let currentResponse: { loading: boolean; stream: string };

    // get messages from store
    messagesStore.subscribe((value) => (messages = value));
    currentResponseStore.subscribe((value) => (currentResponse = value));

    const newInteraction = async (messageValue: string) => {
        console.log(messageValue);

        // add user message
        messagesStore.update((messages) => [
            ...messages,
            {
                role: "user",
                content: messageValue,
            },
        ]);

        // send messages to Ollama API
        await chat({
            model: currentModel,
            messages: messages,
        }).then((response) => {
            // store the LLM response
            messagesStore.update((messages) => [...messages, response]);
        });

        console.log(messages);
    };

    onMount(async () => {
        allModels = await ollamaAPI.models.list().then((d) => d["models"]);
        console.log(allModels);
    });
</script>

<!-- Sidebar -->
<Sidebar />

<!-- Topbar -->
{#if messages.length > 0}
    <nav>
        {#if allModels}
            <Select
                data={allModels.map((m) => m.name.split(":")[0])}
                bind:value={currentModel}
            />
        {:else}
            <p>Load models...</p>
        {/if}
    </nav>
{/if}

<main>
    <!-- Chat -->
    {#if messages.length === 0}
        <header>
            <div class="logo">
                <img src="public/ollama.png" alt="" />
            </div>
            <h2>Ollama Chat</h2>
            {#if allModels}
                <Select
                    data={allModels.map((m) => m.name.split(":")[0])}
                    bind:value={currentModel}
                />
            {:else}
                <p>Load models...</p>
            {/if}
        </header>
    {/if}

    <form
        on:submit={(e) => {
            e.preventDefault();
            newInteraction(messageValue);
            messageValue = "";
        }}
    >
        <TextAreaAutosize
            bind:value={messageValue}
            minRows={1}
            maxRows={10}
            onSubmit={newInteraction}
            placeholder={`Message to ${currentModel} ...`}
        />
        <button type="submit"><ArrowUpIcon /></button>
    </form>

    <div class="messages-container">
        {#each messages as message}
            <Message {message} />
        {/each}
        {#if currentResponse.loading}
            <Message
                message={{
                    role: "assistant",
                    content: currentResponse.stream,
                }}
            />
        {/if}
    </div>
</main>

<!-- ShowdownJS & MathJax -->

<style lang="scss">
    header {
        height: 60vh;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 2rem;

        &::after {
            content: "";
            width: 10rem;
            height: 10rem;
            background: rgba(var(--color-primary-700), 0.6);
            position: absolute;
            border-radius: 100px;
            filter: blur(1000px);
        }

        h2 {
            font-size: var(--text-size-2xl);
            font-weight: 700;
        }

        .logo {
            background: #fff;
            width: 4rem;
            height: 4rem;
            padding: 0.6rem;
            padding-top: 0.2rem;
            padding-bottom: 0;
            border-radius: var(--border-radius-1);

            display: flex;
            align-items: flex-end;
            justify-content: center;

            img {
                height: 100%;
            }
        }
    }

    main {
        margin: 2rem 20%;
    }

    .messages-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 4rem;

        &::after {
            content: "";
            width: 100%;
            height: 8vh;
            position: fixed;
            bottom: 0;
            left: 0;
            background: linear-gradient(
                0deg,
                rgb(var(--color-surface-900)),
                transparent
            );
        }
    }

    form {
        display: flex;
        position: fixed;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;

        button {
            width: 2rem;
            height: 2rem;
            position: fixed;
            right: 0.8rem;
            top: 50%;
            transform: translateY(-50%);
            border-radius: var(--border-radius-2);

            display: grid;
            place-items: center;

            background: rgb(var(--color-surface-800));
            box-shadow: 0 0 0 1px rgb(var(--color-surface-800));

            &:hover {
                box-shadow: 0 0 0 1px rgb(var(--color-surface-600));
            }

            svg {
                background: #000;
                stroke: rgb(var(--color-surface-800));
            }
        }
    }
</style>
