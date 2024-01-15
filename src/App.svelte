<script lang="ts">
  import chat from "./lib/chat";
  import {messagesStore, currentResponseStore} from "./lib/messages";
  import type {Message} from "./lib/types"

  let messageValue = '';
  let promptField: HTMLInputElement;

  let currentModel = 'mistral';
  let messages: Message[] = [];
  let currentResponse: {loading: boolean, stream: string};

  // get messages from store
  messagesStore.subscribe(value => messages = value);
  currentResponseStore.subscribe(value => currentResponse = value);

  const newInteraction = async (e: SubmitEvent, messageValue: string) => {
    e.preventDefault();

    // add user message
    messagesStore.update(messages => [...messages, {
      role: "user",
      content: messageValue
    }])

    // send messages to Ollama API
    await chat({
      model: currentModel,
      messages: messages
    }).then(response => {
      // store the LLM response
      messagesStore.update(messages => [...messages, response])
    })

    console.log(messages);
  }


  const resetPromptField = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      promptField.value= ""
    }
  }

</script>

<main>
  <h2>Ollama Chat</h2>

  <form on:submit={(e) => newInteraction(e, messageValue)}>
    <input type="text" bind:this={promptField} on:keydown={resetPromptField} bind:value={messageValue}>
  </form>

  {#each messages as message }
    {#if message.role == "user"}
      <p>You: {message.content}</p>
    {:else}
      <p>{currentModel} : {message.content}</p>
    {/if}
  {/each}
  {#if currentResponse.loading}
    <p>{currentModel}: {currentResponse.stream}</p>
  {/if}
</main>

<!-- ShowdownJS & MathJax -->