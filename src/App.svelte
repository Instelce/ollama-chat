<script lang="ts">
    import { onMount } from "svelte";
    import chatWithModel, { generateChatName } from "./lib/chat";
    import type { ChatType, MessageType, ModelType } from "./lib/types";
    import {
        currentChatStore,
        currentResponseStore,
        emptyChat,
    } from "./lib/stores/messages";
    import { capitalize } from "./lib/utils/helpers";
    import { ArrowUpIcon, SettingsIcon, EditIcon } from "svelte-feather-icons";
    import Sidebar from "./lib/components/Sidebar.svelte";
    import Message from "./lib/components/Message.svelte";
    import TextAreaAutosize from "./lib/components/TextAreaAutosize.svelte";
    import Select from "./lib/components/Select.svelte";
    import Button from "./lib/components/Button.svelte";
    import { historyStore } from "./lib/stores/history";
    import ollamaAPI from "./lib/api";

    let sidebarIsCollapsed: boolean;

    // Models
    let currentModel = "mistral:latest";
    let allModels: ModelType[] = [];

    // Messages
    let messageValue: string;
    let currentResponse: { loading: boolean; stream: string };

    // Chat
    let history: ChatType[];
    let currentChat: ChatType;
    let chatNamePromise = Promise.resolve([]);
    // let chatIndex = history.indexOf()

    // get data from stores
    currentChatStore.subscribe((value) => (currentChat = value));
    currentResponseStore.subscribe((value) => (currentResponse = value));
    historyStore.subscribe((value) => (history = value));

    const newInteraction = async (messageValue: string) => {
        console.log(messageValue);

        // add user message
        currentChatStore.update((chat) => {
            return {
                ...chat,
                messages: [
                    ...chat.messages,
                    {
                        role: "user",
                        content: messageValue,
                    },
                ],
            };
        });

        // send messages to Ollama API
        await chatWithModel({
            model: currentModel,
            messages: currentChat.messages,
        }).then((response) => {
            // store the LLM response
            currentChatStore.update((chat) => {
                return {
                    ...chat,
                    messages: [...chat.messages, response],
                };
            });
        });

        // add new chat if it's the first interaction
        if (currentChat.messages.length == 2) {
            chatNamePromise = generateChatName({
                model: currentModel,
                prompt: currentChat.messages[currentChat.messages.length - 1].content,
            }).then((data) => {
                console.log("New chaaat");
                currentChatStore.set({
                    id: history.length + 1,
                    name: data.response,
                    model: currentModel,
                    messages: currentChat.messages,
                });
                historyStore.update((value) => [...value, currentChat]);
            });
        }

        // add chat to history
        if (currentChat != emptyChat) {
            historyStore.update((history) => {
                return history.map((chat) => {
                    if (chat.id === currentChat.id) {
                        return currentChat;
                    } else {
                        return chat;
                    }
                });
            });
        }

        // make a save to local storage
        localStorage.setItem("history", JSON.stringify(history));
    };

    function newChat() {
        // add chat to history
        if (currentChat != emptyChat) {
            historyStore.update((history) => {
                return history.map((chat) => {
                    if (chat.id === currentChat.id) {
                        return currentChat;
                    } else {
                        return chat;
                    }
                });
            });
        }

        localStorage.setItem("history", JSON.stringify(history));

        currentChatStore.set(emptyChat);
    }

    onMount(async () => {
        // fetch all models
        allModels = await ollamaAPI.models.list().then((d) => d["models"]);
        console.log(allModels);
        

        // get data from local storage
        if (localStorage.getItem("history")) {
            historyStore.set(JSON.parse(localStorage.getItem("history") as string))
        }
    });

    $: console.log("chat", currentChat);
</script>

<!-- Sidebar -->
<div class="container">
    <Sidebar bind:isCollapsed={sidebarIsCollapsed} newChat={() => newChat()} />

    <main>
        <!-- Topbar -->
        <nav>
            <!-- New chat button -->
            {#if sidebarIsCollapsed}
                <Button square onClick={newChat}><EditIcon size="18" /></Button>
            {:else}
                <span></span>
            {/if}
            {#if currentChat.messages.length > 0}
                <p class="model">{capitalize(currentModel)}</p>
            {:else}
                <span></span>
            {/if}

            <!-- Settings button -->
            <Button square><SettingsIcon size="18" /></Button>
        </nav>

        {#if currentChat.messages.length === 0}
            <!-- Header -->
            <header>
                <div class="logo">
                    <img src="/ollama.png" alt="Ollama logo" />
                </div>
                <h2>Ollama Chat</h2>
                {#if allModels}
                    {#if allModels.length === 0}
                        <p>Follow instruction on this <a href="https://github.com/jmorganca/ollama/blob/main/docs/faq.md#how-do-i-use-ollama-server-environment-variables-on-linux">page</a>. Or install a <a href="https://ollama.ai/library">model</a>.</p>
                    {:else}
                        <Select
                            data={allModels.map((m) => {
                                return {
                                    value: m.name,
                                    text: `${capitalize(m.name.split(":")[0])} | ${capitalize(m.name.split(":")[1])} (${m.details.parameter_size})`
                                }
                            })}
                            bind:value={currentModel}
                        />
                    {/if}
                {:else}
                    <p>Load models...</p>
                {/if}
            </header>
        {:else}
            <!-- Chat messages -->
            <div class="messages-container">
                {#each currentChat.messages as message}
                    <Message {message} />
                {/each}
                {#if currentResponse.loading}
                    <Message
                        isLoading
                        message={{
                            role: "assistant",
                            content: currentResponse.stream,
                        }}
                    />
                {/if}
            </div>
        {/if}

        <!-- Prompt input -->
        <form
            on:submit={(e) => {
                e.preventDefault();
                if (messageValue !== "") {
                    newInteraction(messageValue);
                    messageValue = "";
                }
            }}
        >
            <div>
                <TextAreaAutosize
                    bind:value={messageValue}
                    minRows={1}
                    maxRows={10}
                    onSubmit={newInteraction}
                    placeholder={`Message to ${currentModel} ...`}
                />
                <Button type="submit" square><ArrowUpIcon /></Button>
            </div>
        </form>
    </main>
</div>

<!-- ShowdownJS & MathJax -->

<style lang="scss">
    .container {
        height: 100%;
        width: 100vw;
        display: flex;
        position: relative;
        overflow: hidden;
    }

    nav {
        width: 100%;
        padding: 1rem 2rem;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;

        background: rgb(var(--color-surface-900));

        display: flex;
        align-items: center;
        justify-content: space-between;

        .model {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    main {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: scroll;
    }

    header {
        height: 100vh;

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

    .messages-container {
        width: 800px;
        height: 100vh;
        padding: 6rem 0rem;
        margin: auto;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: scroll;

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
        z-index: 10;
        padding: 1rem 0;

        display: flex;
        align-items: center;
        justify-content: center;

        & > div {
            width: 800px;
            position: relative;
        }

        & :global(button) {
            position: absolute;
            right: 0.4rem;
            top: 50%;
            transform: translateY(-50%);

            border-radius: var(--border-radius-2);
            background: rgb(var(--color-surface-800));
            box-shadow: 0 0 0 1px rgb(var(--color-surface-800));

            &:active {
                transform: translateY(-50%) scale(0.95);
            }
        }
    }

    svg {
        background: #000;
        stroke: rgb(var(--color-surface-800));
    }
</style>
