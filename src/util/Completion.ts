// @ts-nocheck
/* const { OpenAIClient, AzureKeyCredential } = require("@azure/openai"); */
import {OpenAIClient, AzureKeyCredential} from "@azure/openai"

// You will need to set these environment variables or edit the following values
const azureApiKey = ""
const endpoint = "";

const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "me puedes dar un codigo de ejemplo en python que saluda" },
];

function streamChatCompletions(client:any, deploymentId:any, messages:any, options:any) {
  const events = client.listChatCompletions(deploymentId, messages, options);
  const stream = new ReadableStream({
    async start(controller:any) {
      for await (const event of events) {
        controller.enqueue(event);
      }
      controller.close();
    },
  });

  return stream;
}

async function requestGtpAzureStream(messages:any) {

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "Gpt4";
  const stream = streamChatCompletions(client, deploymentId, messages, { maxTokens: 128 });
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    for (const choice of value.choices) {
      if (choice.delta?.content !== undefined) {
        console.log(choice.delta);
      }
    }
  }
}


async function requestGtpAzure(messages:any) {
  console.log("== Chat Completions Sample ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "Gpt4";
  const result = await client.getChatCompletions(deploymentId, messages);

  return result;

}

export {requestGtpAzureStream,requestGtpAzure};