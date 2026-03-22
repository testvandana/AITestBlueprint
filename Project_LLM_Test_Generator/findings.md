# Findings

## Research
- The application will act as a dashboard with a chat-like interface where users provide requirements ("Ask here is here TC for Requiremnt").
- Must display currently selected models.
- Features dual-panel layout (Generator View and Settings View based on design).

## Discoveries
- **Settings Layout**: The design wireframe dictates a layout for configurations including sections for each API (Ollama, Groq, OpenAI, etc.), along with "Save Button" and "Test Connection" actions.
- **Generator Layout**: Includes a "History" sidebar and a main chat/output area showing generated test cases.

## Constraints
- MUST provide test cases strictly in a Jira format.
- Output MUST include functional test cases, and can include non-functional test cases.
- Export to Excel feature is mandatory.
- Code must reside in the Node.js/React TypeScript ecosystem.
