import OpenAI from "openai";
import * as dotenv from "dotenv";
import { ChatCompletionMessageParam } from "openai/resources/chat";

dotenv.config();

class Agent {
  private openai: OpenAI;
  private conversationHistory: ChatCompletionMessageParam[];

  constructor(
    public id: string,
    private model: string = "gpt-4o-mini",
    private system_prompt: string,
    public historyLimit: number = 20,
  ) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in the environment.");
    }

    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.conversationHistory = [];
    this.historyLimit = historyLimit;
    this.model = model;
    this.id = id;
  }

  public async generateResponse(prompt: string): Promise<string> {
    this.conversationHistory.push({ role: "user", content: prompt });

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: this.system_prompt },
          ...this.conversationHistory,
        ],
      });

      const response = completion.choices[0].message?.content || "No response";
      this.conversationHistory.push({ role: "assistant", content: response });

      // Keep only the last N messages
      if (this.conversationHistory.length > this.historyLimit * 2) {
        this.conversationHistory = this.conversationHistory.slice(
          this.conversationHistory.length - this.historyLimit * 2,
        );
      }

      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      return "Error generating response.";
    }
  }

  public getConversationHistory(): ChatCompletionMessageParam[] {
    return this.conversationHistory;
  }

  public clearConversationHistory(): void {
    this.conversationHistory = [];
  }
}

export default Agent;
