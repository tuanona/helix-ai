import ApiBase from "../models/api";
import * as types from "./gemini.types";
import config from "../config";
import { log } from "../utils";

export default class Gemini extends ApiBase {
  constructor() {
    super({
      url: config.geminiEndpoint as string,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": config.geminiKey as string,
      },
    });
  }

  async chat(
    request: string,
    contents: string,
    filepath: string,
    languageId: string
  ): Promise<types.Chat> {
    const systemInstruction = `You are an AI programming assistant.
Follow the user's requirements carefully & to the letter.
- Each code block starts with \`\`\` and // FILEPATH.
- You always answer with ${languageId} code.
- When the user asks you to document something, you must answer in the form of a ${languageId} code block.
Your expertise is strictly limited to software development topics.
For questions not related to software development, simply give a reminder that you are an AI programming assistant.
Keep your answers short and impersonal.`;

    const body = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `I have the following code in the selection:\n\`\`\`${languageId}\n// FILEPATH: ${filepath.replace(
                "file://",
                ""
              )}\n${contents}`,
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: request }],
        },
      ],
      generationConfig: {
        maxOutputTokens: parseInt(config.geminiMaxTokens as string),
        temperature: 0.1,
        topP: 1,
      },
    };

    const model = config.geminiModel;
    const data = await this.request({
      method: "POST",
      body,
      endpoint: `/v1beta/models/${model}:generateContent`,
      timeout: config.actionTimeout,
    });

    return types.Chat.fromResponse(data, filepath, languageId);
  }

  async completion(
    contents: any,
    filepath: string,
    languageId: string
  ): Promise<types.Completion> {
    const systemInstruction =
      (config.geminiContext as string)?.replace("<languageId>", languageId) +
      "\n\n" +
      `End of file context:\n\n${contents.contentAfter}`;

    const body = {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: `Start of file context:\n\n${contents.contentBefore}` },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: parseInt(config.geminiMaxTokens as string),
        temperature: config.numSuggestions > 1 ? 0.4 : 0,
        topP: 1,
        candidateCount: config.numSuggestions,
      },
    };

    const model = config.geminiModel;
    const data = await this.request({
      method: "POST",
      body,
      endpoint: `/v1beta/models/${model}:generateContent`,
    });

    return types.Completion.fromResponse(data);
  }
}
