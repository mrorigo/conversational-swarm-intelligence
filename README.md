# Conversational Swarm Intelligence (CSI) Simulation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project simulates a Conversational Swarm Intelligence (CSI) system using AI agents.  Inspired by the paper **"Conversational Swarm Intelligence for Brainstorming" (https://arxiv.org/pdf/2412.14205)**, it explores how a networked group of AI agents can collaborate, share insights, and converge on solutions to complex problems, mimicking the collective intelligence observed in natural swarms.

## Overview

The core idea behind Conversational Swarm Intelligence is to emulate the intelligent behavior of swarms (e.g., a school of fish) where collective decisions often surpass the capabilities of individual members. The original paper addresses the limitations of traditional brainstorming sessions, which often struggle with large groups due to conversational bottlenecks.  CSI overcomes this by dividing a large group into smaller subgroups, interconnected through AI agents that facilitate efficient information exchange.

This project takes the foundational principles of CSI and applies them to a system of interacting AI agents. Instead of human participants, we use AI agents powered by Large Language Models (LLMs) to brainstorm, discuss, and synthesize ideas. This allows for rapid experimentation and exploration of CSI dynamics in a controlled environment.

## Key Features

*   **AI Agent-Based Simulation:**  Replaces human participants with AI agents, enabling rapid experimentation and analysis of CSI dynamics.
*   **Subgroup Conversations:** Divides agents into smaller subgroups, facilitating focused discussions.
*   **Automated Insight Sharing:**  AI-powered summarization and sharing of key insights between subgroups.
*   **Multi-Round Discussions:** Supports multiple rounds of discussions after each sharing of insights, allowing the agents to refine their ideas and build upon each other's contributions.
*   **Final Report Generation:**  Synthesizes shared insights into a comprehensive final report, highlighting key conclusions and potential solutions.
*   **Configurable System:** Provides options for customization and experimentation, allowing the user to control the number of agents, groups, discussion rounds, and even the language models used by each agent.

## Architecture

The system comprises the following key components:

*   **`Agent` Class:**
    *   Represents an individual AI agent with the ability to participate in conversations and generate responses using the OpenAI API.
    *   Has a unique ID, a specified language model (`model`, defaulting to `gpt-4o-mini`), and a system prompt (`system_prompt`) defining its behavior.
    *   Maintains a limited conversation history (`conversationHistory`), ensuring context awareness while managing resource usage.
    *   `generateResponse(prompt: string)`: Generates a response to a given prompt, updating the conversation history.
    *   `getConversationHistory()`: Returns the agent's conversation history.
    *   `clearConversationHistory()`: Clears the agent's conversation history.

*   **`Conversation` Class:**
    *   Manages the conversation within a subgroup of agents.
    *   Stores the participating agents (`agents`), the topic of discussion (`topic`), and the conversation history (`conversationHistory`).
    *   `startConversation(initialPrompt?: string, maxSteps: number = 5)`: Initiates the conversation, guiding the agents through a series of prompts and responses for a specified number of steps (`maxSteps`).

*   **`Network` Class:**
    *   Orchestrates the overall CSI system, managing agent subgroups, conversation initiation, and insight sharing.
    *   Creates subgroups from a list of agents (`agents`) using `createSubgroups(subgroupSize: number)`.
    *   `startConversations(topic: string, numRounds: number = 3, maxSteps: number = 5)`: Manages the conversation rounds and insight sharing.
    *   `shareInsights(conversations: Conversation[])`: Summarizes the conversations within each subgroup and shares these summaries with other subgroups.
    *   `generateFinalReport(topic: string)`: Generates a final report based on all the shared insights.
    *   `addSummaryToConversationHistory(agent: Agent, summary: string)`: Adds shared insights to an agent's conversation history to allow for additional discussions based on the new information.
    *   `summarizeConversation(conversationHistory: string)`: Summarizes a given conversation history.
    *   `summarizeSharedInsights(sharedInsights: string, topic: string)`: Summarizes all shared insights.

## Usage

### Prerequisites

*   Node.js (v18 or higher)
*   npm (Node Package Manager)
*   An OpenAI API key.  Set the environment variable `OPENAI_API_KEY`.

### Installation

1.  Clone the repository:

    ```bash
    git clone [repository URL]
    cd conversational-swarm
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

### Running the Simulation

You can run the simulation from the command line using `node index.js` with various options to customize the simulation.

```bash
node index.js [OPTIONS]
```

#### Options:

*   `--agents AGENTS`:  The number of agents to use in the conversation.
*   `--groups GROUPS`:  The number of groups to divide the agents into.
*   `--rounds ROUNDS`:  The number of rounds to run the conversation (Default: 3).
*   `--steps STEPS`:  The number of steps to run the conversation in each round before sharing insights (Default: 5).
*   `--models MODELS`: The models to use for the agents, separated by commas (e.g., `--models gpt-4o,gpt-4o-mini`).
*   `-t, --text TEXT`: The text to be used as context for the conversation.
*   `-f, --file FILE`: The path to a file containing the text to be used as context.
*   `-h, --help`: Display this help information.

**Example:**

```bash
node index.js --agents 6 --groups 3 --rounds 4 -t "Discuss the potential applications of quantum computing in healthcare."
```

This command will create 6 agents, divide them into 3 groups, run the conversation for 4 rounds, and use the provided text as the context for the discussions.

You can also provide the context through a file. For example, create a text file named `context.txt` and pass it like this:

```bash
node index.js --agents 4 --groups 2 -f context.txt
```

## Example Output

After the simulation is complete, the final report summarizing the key insights and conclusions will be printed to the console.  For example:

```
Final Report:
The AI agents identified several potential applications of quantum computing in healthcare, including drug discovery, personalized medicine, and improved diagnostics. They also discussed the challenges associated with implementing quantum computing in healthcare, such as the high cost of quantum computers and the need for specialized expertise.
...
```

## Future Directions

*   **More Sophisticated Agent Behavior:**  Implement more complex agent behaviors, such as conflict resolution, idea prioritization, and consensus building.
*   **Dynamic Network Topology:** Explore dynamic network topologies where subgroups can merge, split, or reconfigure based on the flow of information.
*   **Real-World Data Integration:** Integrate the system with real-world data sources to provide agents with more context and information.
*   **GUI Implementation:** Develop a graphical user interface (GUI) for easier interaction and visualization of the CSI process.
*   **Integration with Vector Databases:** Use vector embeddings of agent summaries to allow the agents to search the space of previously discussed items for relevance and insights.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
