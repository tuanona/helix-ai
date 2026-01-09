import { uniqueStringArray, extractCodeBlock, log } from "../utils";

export class Completion extends Array<string> {
  constructor(...items: string[]) {
    super();
    this.push(...uniqueStringArray(items));
  }

  static fromResponse(data: any): Completion {
    // Gemini response format: { candidates: [{ content: { parts: [{ text: "..." }] } }] }
    const choices =
      data?.candidates?.map(
        (c: any) => c.content?.parts?.map((p: any) => p.text).join("") ?? ""
      ) ?? [];
    return new Completion(...choices);
  }
}

export class Chat {
  result: string;

  constructor(data: string) {
    this.result = data;
  }

  static fromResponse(data: any, filepath: string, language: string): Chat {
    // Gemini response format: { candidates: [{ content: { parts: [{ text: "..." }] } }] }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const result = extractCodeBlock(filepath, text, language);
    return new Chat(result as string);
  }
}
