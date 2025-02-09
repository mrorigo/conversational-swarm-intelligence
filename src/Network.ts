import Agent from "./Agent";
import Conversation from "./Conversation";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";

class Network {
  private agents: Agent[];
  private subgroups: Agent[][];
  private openai: OpenAI;
  private sharedInsights: string[];

  constructor(agents: Agent[]) {
    this.agents = agents;
    this.subgroups = [];
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.sharedInsights = []; // Store shared insights
  }

  public createSubgroups(subgroupSize: number): void {
    this.subgroups = [];
    for (let i = 0; i < this.agents.length; i += subgroupSize) {
      this.subgroups.push(this.agents.slice(i, i + subgroupSize));
    }
  }

  public async startConversations(
    topic: string,
    numRounds: number = 3,
    maxSteps: number = 5,
  ): Promise<string> {
    if (this.subgroups.length === 0) {
      throw new Error("No subgroups created. Please create subgroups first.");
    }

    const conversations: Conversation[] = this.subgroups.map(
      (agents) => new Conversation(agents, topic),
    );

    // Initial round of conversations
    console.log(`== Starting initial round of discussions...`);
    await Promise.all(
      conversations.map((conversation) =>
        conversation.startConversation(undefined, maxSteps),
      ),
    );

    for (let round = 1; round < numRounds; round++) {
      console.log(`== Starting round ${round} of discussions...`);
      // Share insights after conversations
      await this.shareInsights(conversations);

      // Start new rounds of discussions based on shared insights
      await Promise.all(
        conversations.map((conversation) =>
          conversation.startConversation(
            `Round ${round + 1}: Discussing insights from other subgroups.`,
            maxSteps,
          ),
        ),
      );
    }

    // Generate final report
    const finalReport = await this.generateFinalReport(topic);

    return finalReport;
  }

  private async shareInsights(conversations: Conversation[]): Promise<void> {
    console.log("Sharing insights between subgroups...");

    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      const conversationHistory = conversation
        .getConversationHistory()
        .join("\n");

      try {
        const summary = await this.summarizeConversation(conversationHistory);
        console.log(`Summary of subgroup ${i + 1}: ${summary}`);

        this.sharedInsights.push(summary); // Store the shared insight

        // Share the summary with other subgroups (excluding the current one)
        for (let j = 0; j < this.subgroups.length; j++) {
          if (i !== j) {
            const otherSubgroup = this.subgroups[j];
            for (const agent of otherSubgroup) {
              // Add summary to conversation history directly
              this.addSummaryToConversationHistory(
                agent,
                `Summary from subgroup ${i + 1}: ${summary}`,
              );
            }
          }
        }
      } catch (error) {
        console.error(
          `Error summarizing conversation for subgroup ${i + 1}:`,
          error,
        );
      }
    }

    console.log("Insights shared.");
  }

  private addSummaryToConversationHistory(agent: Agent, summary: string): void {
    const conversationHistory = agent.getConversationHistory();
    conversationHistory.push({
      role: "user",
      content: summary,
    });
  }

  private async summarizeConversation(
    conversationHistory: string,
  ): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that summarizes conversations. Provide a concise summary of the following conversation, highlighting the key insights:",
          },
          { role: "user", content: conversationHistory },
        ],
      });

      return completion.choices[0].message?.content || "No summary available.";
    } catch (error) {
      console.error("Error summarizing conversation:", error);
      return "Error summarizing conversation.";
    }
  }

  private async generateFinalReport(topic: string): Promise<string> {
    console.log("Generating final report...");

    try {
      const report = await this.summarizeSharedInsights(
        this.sharedInsights.join("\n"),
        topic,
      );
      console.log("Final Report:\n", report);
      return report;
    } catch (error) {
      console.error("Error generating final report:", error);
      return "Error generating final report.";
    }
  }

  private async summarizeSharedInsights(
    sharedInsights: string,
    topic: string,
  ): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that summarizes a set of shared insights and generates a final report. Provide a concise summary of the following insights, highlighting the key conclusions reached by the agents during the discussions about " +
              topic +
              ":",
          },
          { role: "user", content: sharedInsights },
        ],
      });

      return (
        completion.choices[0].message?.content || "No final report available."
      );
    } catch (error) {
      console.error("Error summarizing shared insights:", error);
      return "Error summarizing shared insights.";
    }
  }
}

export default Network;
