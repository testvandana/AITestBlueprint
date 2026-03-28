# Findings & Constraints

## Discovery (Phase 1)
- The user has Jira, ADO, and X-Ray in their ALM stack.
- API keys for Jira and ADO are ready to use.
- The single source of truth for features is Jira/ADO User Stories.
- The formatting source of truth is `Test Plan - Template.docx`.
- Delivery must go to three locations:
  1. Uploaded on Jira.
  2. Emailed to stakeholders.
  3. Saved locally as a PDF.
- **Constraints:** Strict validation rule added. The agent must halt if acceptance criteria are missing. It will not generate a plan without a robust User Story.
- **Data additions (Template matched):** Test Environment, In-Scope, Out-of-Scope boundaries have been registered to the payload schema.
