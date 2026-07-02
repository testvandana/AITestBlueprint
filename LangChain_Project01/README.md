# LangChain Project01

This folder contains a small set of Python examples demonstrating core concepts in **LangChain**:
- basic LLM usage
- prompt + chaining
- tools / agents (basic agent workflow)

## Project structure

- `src/00_level_langchain.py`  
  Baseline LangChain setup and a minimal “call the model” example.

- `src/01_level_langchain.py`  
  Prompting / runnable composition example (build a chain and invoke it).

- `src/02_chain_agent.py`  
  Chain + (optionally) tool/agent style orchestration demonstrating agent-like flows.

- `src/03_AI_Agent.py`  
  Agent-focused example: shows how to structure an AI agent workflow with LangChain.

## How to run

1. Make sure you have Python installed (3.9+ recommended).
2. Install dependencies (if the repo includes a `requirements.txt`, use it; otherwise install `langchain` and the provider SDK you use):
   - `pip install langchain`
   - Plus the provider package (e.g., OpenAI / Anthropic / Gemini) depending on what your code uses.

3. Set environment variables required by the model provider.
   - Example (OpenAI):
     - `OPENAI_API_KEY=...`

4. Run a script:
   - `python src/00_level_langchain.py`
   - `python src/01_level_langchain.py`
   - `python src/02_chain_agent.py`
   - `python src/03_AI_Agent.py`

## Notes

- These files are intended as learning snippets. Some scripts may require provider-specific environment variables.
- If you get import/provider errors, install the missing provider SDK and ensure the required API key is set.

## Testing performed

So far, only Git commit/push was performed. After this README addition, run/import the scripts once to verify there are no syntax/import issues:
- `00_level_langchain.py`
- `01_level_langchain.py`
- `02_chain_agent.py`
- `03_AI_Agent.py`
