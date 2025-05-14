// Needed to install the following packages:
// This sample demonstrates how to use the Azure OpenAI client library for JavaScript.
//  {
//   "type": "module",
//   "dependencies": {
//     "openai": "latest",
//     "@azure/identity": "latest"
//   }
// }

import { AzureOpenAI } from "openai";

const endpoint = "https://shboyer-build25-resource.cognitiveservices.azure.com/";
const modelName = "gpt-4o-mini";
const deployment = "gpt-4o-mini";

export async function main() {

  const apiKey = "<your-api-key>";
  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion }

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: [
      { role:"system", content: "You are a helpful assistant." },
      { role:"user", content: "I am going to Paris, what should I see?" }
    ],
    max_tokens: 4096,
      temperature: 1,
      top_p: 1,
      model: modelName
  });

  if (response?.error !== undefined && response.status !== "200") {
    throw response.error;
  }
  console.log(response.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});