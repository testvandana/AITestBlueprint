# 📖 Project Constitution

## 1. Vision (North Star)
A deterministic agent that automatically generates comprehensive test plans from a provided Story ID (using a predefined `.docx` template) and shares the output.

## 2. Behavioral Rules
- **Data Validation First:** If an ALM (Jira/ADO) story contains missing or highly ambiguous information (e.g., missing Acceptance Criteria), the agent MUST halt execution and ask the human for a proper, detailed story. It should never guess or infer.

## 3. Data Schemas (The "Data-First" Rule)
*Status: Initial Draft - Needs Confirmation*

**📥 Input Schema (`StoryRequest`)**
```json
{
  "ticket_id": "string",
  "alm_system": "JIRA | ADO",
  "delivery_email": "string"
}
```

**🔍 Extracted Source Data Schema (`TicketData`)**
```json
{
  "title": "string",
  "description": "string",
  "acceptance_criteria": "string",
  "story_points": "integer",
  "assignee": "string",
  "test_environment": "string[]",
  "in_scope": "string[]",
  "out_of_scope": "string[]"
}
```

**📤 Delivery Payload Schema (`TestPlanResult`)**
```json
{
  "status": "success | error",
  "generated_plan_pdf_path": "string",
  "jira_upload_status": "string",
  "email_delivery_status": "string"
}
```

## 4. Architectural Invariants
- No generation of Test Plans if the Jira/ADO story has no defined acceptance criteria.
- Never guess at business logic.
- Use `.tmp/` for all intermediate file operations.
