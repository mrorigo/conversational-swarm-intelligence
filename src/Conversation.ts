import Agent from "./Agent";

class Conversation {
  private agents: Agent[];
  private topic: string;
  private conversationHistory: string[];

  constructor(agents: Agent[], topic: string) {
    this.agents = agents;
    this.topic = topic;
    this.conversationHistory = [];
  }

  public async startConversation(
    initialPrompt?: string,
    maxSteps: number = 5,
  ): Promise<void> {
    console.log(`Starting conversation on topic: ${this.topic}`);

    // Initial prompt to kick off the conversation
    let currentPrompt =
      initialPrompt ||
      `Let's discuss: ${this.topic}. What are your initial thoughts?`;
    let currentAgentIndex = 0;

    for (let i = 0; i < maxSteps; i++) {
      // Limit conversation to 5 rounds for simplicity
      const currentAgent = this.agents[currentAgentIndex];
      console.log(`Agent ${currentAgent.id}'s turn`);
      const response = await currentAgent.generateResponse(currentPrompt);

      this.conversationHistory.push(`${currentAgent.id}: ${response}`);
      console.log(`${currentAgent.id}: ${response}`);

      // Prepare the next prompt based on the current response
      currentPrompt = `Agent ${currentAgent.id} said: ${response}. What are your thoughts?`;

      // Move to the next agent in a round-robin fashion
      currentAgentIndex = (currentAgentIndex + 1) % this.agents.length;
    }

    console.log("Conversation finished.");
  }

  public getConversationHistory(): string[] {
    return this.conversationHistory;
  }

  public getAgents(): Agent[] {
    return this.agents;
  }

  public getTopic(): string {
    return this.topic;
  }
}

export default Conversation;
