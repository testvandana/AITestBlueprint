<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered%20Testing-blueviolet?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-Framework-darkgreen?style=for-the-badge&logo=chainlink&logoColor=white" />
  <img src="https://img.shields.io/badge/CrewAI-Agents-orange?style=for-the-badge&logo=robot&logoColor=white" />
  <img src="https://img.shields.io/badge/MCP-Protocol-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/RAG-Retrieval%20Augmented-teal?style=for-the-badge" />
</p>

# 🧪 Vandana AI Projects — AI Test Blueprint

> **A curated collection of AI-powered software testing projects** exploring how Large Language Models (LLMs), AI Agents, Retrieval-Augmented Generation (RAG), and automation workflows can transform the Software Testing Life Cycle (STLC).

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Repository Structure](#-repository-structure)
- [Projects](#-projects)
  - [1. CREW-AI-QA-Pipeline](#1-crew-ai-qa-pipeline)
  - [2. Chapter-4-AI-Agents (Test Planner Agent)](#2-chapter-4-ai-agents-test-planner-agent)
  - [3. Chapter-8-RAG (RAG for QA)](#3-chapter-8-rag-rag-for-qa)
  - [4. CrewAI Agents](#4-crewai-agents)
  - [5. JIRA-MCP (JIRA MCP Server)](#5-jira-mcp-jira-mcp-server)
  - [6. LangChain Project01](#6-langchain-project01)
  - [7. MCP-Creation (Test-Case Explorer MCP)](#7-mcp-creation-test-case-explorer-mcp)
  - [8. Project1 — Test Plan RICEPOT](#8-project1--test-plan-ricepot)
  - [9. Project2 — Test Cases API](#9-project2--test-cases-api)
  - [10. Project — LLM Test Generator](#10-project--llm-test-generator)
  - [11. Project — RICE POT Framework](#11-project--rice-pot-framework)
  - [12. Project — STLC Prompt Engineering](#12-project--stlc-prompt-engineering)
  - [13. Python Learning](#13-python-learning)
  - [14. n8n Workflows](#14-n8n-workflows)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔭 Overview

This repository is a **hands-on learning lab** for applying Artificial Intelligence to Quality Assurance and Software Testing. Each project addresses a different aspect of the AI-testing landscape:

| Theme | What You'll Find |
|---|---|
| 🤖 **AI Agents** | Multi-agent systems using CrewAI and LangChain that analyze requirements and generate test plans / test cases autonomously |
| 📚 **RAG (Retrieval-Augmented Generation)** | End-to-end pipelines that ingest PDFs, chunk them, store embeddings in ChromaDB, and answer questions about product requirements |
| 🔌 **MCP Servers** | Model Context Protocol servers that expose test-case data and JIRA integration to any MCP-capable LLM client (Claude, Cursor, etc.) |
| 📝 **Prompt Engineering for STLC** | Structured prompt templates, anti-hallucination rules, and context-brain patterns for generating test artifacts from PRDs |
| ⚙️ **Automation Workflows** | n8n workflow definitions that connect JIRA, Google Docs, and AI models to automate test case generation |
| 🧪 **Test Frameworks** | Selenium + TestNG Java framework (RICE POT) for Salesforce automation |

---

## 📁 Repository Structure

```
VandanaAIprojects/
│
├── CREW-AI-QA-Pipeline/          # CrewAI multi-agent QA pipeline
├── Chapter-4-AI-Agents/          # Test Planner Agent (full-stack web app)
├── Chapter-8-RAG/                # RAG pipeline + Advanced RAG with re-ranking
├── CrewAIAgents/                 # Standalone CrewAI agent scripts
├── JIRA-MCP/                     # FastMCP server with Playwright browser tools
├── LangChain_Project01/          # LangChain fundamentals (LLM, chains, agents)
├── MCP-Creation/                 # Test-Case Explorer MCP Server
├── Project1_Test_Plan_RICEPOT/   # AI-generated comprehensive test plan (VWO)
├── Project2_TestCases_API/       # API test case generation (placeholder)
├── Project_LLM_Test_Generator/   # Full-stack LLM Test Generator dashboard
├── Project_RICE_POT_FRAMEWORK/   # Java Selenium + TestNG automation framework
├── Project_STLC_PE/              # STLC Prompt Engineering toolkit
├── Python_Learning/              # Python fundamentals & practice scripts
├── n8n-Workflows/                # n8n workflow JSON exports (JIRA + AI)
├── api/                          # API serverless functions
└── README.md                     # ← You are here
```

---

## 🚀 Projects

### 1. CREW-AI-QA-Pipeline

| | |
|---|---|
| **Description** | A multi-agent QA pipeline built with [CrewAI](https://github.com/joaomdmoura/crewAI) for orchestrating AI agents to perform quality assurance tasks collaboratively. |
| **Tech** | Python, CrewAI |
| **Key Files** | `requirements.txt` |

---

### 2. Chapter-4-AI-Agents (Test Planner Agent)

| | |
|---|---|
| **Description** | A deterministic agent that **automatically generates comprehensive test plans** from a JIRA / Azure DevOps Story ID using a predefined `.docx` template. Includes a full-stack web application with a React frontend and Node.js backend. |
| **Tech** | JavaScript (React + Vite), Node.js (Express), JIRA API, Vercel deployment |
| **Key Features** | • Fetches user stories from JIRA/ADO<br>• Validates acceptance criteria before generation<br>• Outputs formatted test plans (PDF)<br>• Email delivery of generated plans |
| **Architecture** | `frontend/` (React + Vite) · `backend/` (Node.js + Express) · `tools/` · `test-plan-template/` |

---

### 3. Chapter-8-RAG (RAG for QA)

| | |
|---|---|
| **Description** | An end-to-end **Retrieval-Augmented Generation** pipeline that ingests the VWO Product Requirements Document (PDF), chunks the text, generates embeddings with Ollama (Nomic Embed Text), stores them in ChromaDB, and lets you query the PRD through a web UI powered by Groq LLM. |
| **Tech** | Python, Flask, ChromaDB, Ollama, Groq API, HTML/CSS/JS |
| **Key Files** | `ingest_pdf.py` — PDF ingestion & chunking<br>`rag_server.py` — Flask API server (query, chunks, stats)<br>`rag_chunking.py` — Chunking strategies<br>`index.html` — Browser-based chat UI |
| **Advanced RAG** | `Advance_RAG/` — Enhanced pipeline with FastAPI, Sentence-Transformers, Cross-Encoder re-ranking, CSV test case upload, and test case generation from RAG context |

---

### 4. CrewAI Agents

| | |
|---|---|
| **Description** | Standalone CrewAI agent scripts demonstrating how to create AI agents for QA tasks. |
| **Agents** | • **Test Analyst Agent** — A senior QA engineer agent that generates 5-10 test cases for the VWO login page<br>• **Research Writer Agent** — An agent that researches topics and produces written summaries |
| **Tech** | Python, CrewAI, Groq API (GPT-OSS-120B) |

---

### 5. JIRA-MCP (JIRA MCP Server)

| | |
|---|---|
| **Description** | A **FastMCP server** for [The Testing Academy](https://thetestingacademy.com/) that exposes 20+ dummy Playwright browser tools, 3 resources, 2 data items, 5 ROM entries, and 5 prompt definitions. Demonstrates how to build an MCP server for use with Claude Desktop, Cursor, and other MCP clients. |
| **Tech** | Python, FastMCP, Model Context Protocol |
| **Transport** | Supports both `stdio` and `http` transports |
| **Key File** | `server.py` |

---

### 6. LangChain Project01

| | |
|---|---|
| **Description** | A set of progressive Python examples demonstrating core **LangChain** concepts — from basic LLM calls to prompt chaining and agent workflows. |
| **Scripts** | `00_level_langchain.py` — Baseline LLM setup<br>`01_level_langchain.py` — Prompt + chaining (Runnables)<br>`02_chain_agent.py` — Chain + tool orchestration<br>`03_AI_Agent.py` — Full AI agent workflow<br>`bug_triage_agent.py` — Bug triage agent |
| **Tech** | Python, LangChain, OpenAI / Groq / Gemini |

---

### 7. MCP-Creation (Test-Case Explorer MCP)

| | |
|---|---|
| **Description** | A local **Model Context Protocol (MCP) server** that lets any MCP-capable LLM search, filter, and retrieve from a dataset of **480 VWO test cases**. Supports filtering by priority, severity, module, labels, owner, sprint, status, test type, and free text. |
| **Tech** | Python, FastMCP |
| **MCP Tools** | `search_test_cases` · `get_test_case` · `list_filter_values` · `get_stats` |
| **Clients** | Claude Desktop, Claude Code, Cursor, MCP Inspector |
| **Data** | `testcases_vwo_100.csv` (480 test cases with 14 columns) |

---

### 8. Project1 — Test Plan RICEPOT

| | |
|---|---|
| **Description** | A **comprehensive, AI-generated test plan** for the VWO Login Dashboard (`app.vwo.com`). The 1,000+ line document covers test strategy, scope, approach, resources, schedule, risk analysis, and detailed test scenarios — all generated from a Product Requirements Document (PRD). |
| **Deliverables** | `Test_Plan_VWO_Login_Dashboard.md` (62 KB)<br>`Product Requirements Document_ VWO Login Dashboard.docx` |
| **Methodology** | RICEPOT (Risk, Integration, Compliance, Edge-cases, Performance, Operability, Testability) |

---

### 9. Project2 — Test Cases API

| | |
|---|---|
| **Description** | Placeholder project for API-level test case generation. *(Under development)* |

---

### 10. Project — LLM Test Generator

| | |
|---|---|
| **Description** | A full-stack **LLMTestGenBuddy AI** dashboard that generates functional and non-functional test cases for APIs and web applications using multiple LLM providers. Outputs Jira-format test cases with Excel export capability. |
| **Tech** | React (TypeScript + Vite + Tailwind CSS) — Frontend<br>Node.js (TypeScript + Express) — Backend |
| **LLM Providers** | Ollama, LM Studio, Groq, OpenAI, Claude, Gemini |
| **Features** | • Multi-provider LLM configuration<br>• Test connection validation<br>• Chat-style test generation interface<br>• Jira-format output<br>• Excel export |

---

### 11. Project — RICE POT Framework

| | |
|---|---|
| **Description** | A **Java-based test automation framework** using Selenium WebDriver and TestNG, designed for Salesforce application testing. Built with Maven for dependency management. |
| **Tech** | Java 11, Selenium 4.18, TestNG 7.9, Maven |
| **Structure** | Standard Maven layout: `src/main/java/` · `src/test/java/` |

---

### 12. Project — STLC Prompt Engineering

| | |
|---|---|
| **Description** | A structured **Prompt Engineering toolkit** for the Software Testing Life Cycle. Provides context-brain patterns, anti-hallucination rules, and reusable prompt templates to guide LLMs in generating accurate test artifacts from product requirements. |
| **Key Components** | `Anti_Hallucination_Rules/` — Rules preventing LLM hallucinations in test outputs<br>`Context_Brain/` — VWO PRD as grounding context<br>`Prompt_templates/` — Test plan & test scenario templates<br>`Inputs/` — Login page screenshots + test case templates<br>`Deliverables/` & `Outputs/` — Generated test artifacts |

---

### 13. Python Learning

| | |
|---|---|
| **Description** | Fundamental Python practice scripts covering basic syntax, data structures, and small utility programs. |
| **Scripts** | `Hello_World.py` · `Strings.py` · `List_tuple_Dict.py` · `Basic_Identifier.py` · `BMI_Calculator` |

---

### 14. n8n Workflows

| | |
|---|---|
| **Description** | Exported **n8n workflow definitions** that automate test case generation by connecting JIRA, Google Docs, and LLM-powered AI agents. |
| **Workflows** | `Testcase_Gen_with_PRD_JIRA.json` — Generates test cases from JIRA story/epic IDs + Google Docs PRD<br>`JIRA-AI-agent.json` — AI agent workflow for JIRA integration<br>`JIRA-AI-agent-get-issue.json` — Fetches JIRA issues via AI agent<br>`n8nTest1.json` — Test workflow |
| **Logs** | Multiple event log files for workflow execution tracking |

---

## 🛠 Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | Python 3.9+, JavaScript/TypeScript, Java 11 |
| **AI/LLM Frameworks** | LangChain, CrewAI, FastMCP (MCP) |
| **LLM Providers** | Groq, OpenAI, Ollama, Gemini, Claude, LM Studio |
| **Vector DB & Embeddings** | ChromaDB, Nomic Embed Text, Sentence-Transformers |
| **Web Frameworks** | Flask, FastAPI, Express.js, React (Vite) |
| **Test Automation** | Selenium WebDriver 4.18, TestNG 7.9, Playwright |
| **Workflow Automation** | n8n |
| **Build & Deploy** | Maven, npm, Vercel |
| **Protocols** | Model Context Protocol (MCP) — stdio & HTTP transports |

---

## 🏁 Getting Started

### Prerequisites

- **Python** 3.9+ with `pip`
- **Node.js** 18+ with `npm`
- **Java** 11+ with Maven (for RICE POT Framework)
- **Ollama** (for local embeddings & LLM fallback) — [Install Ollama](https://ollama.ai)
- API keys for cloud LLM providers (Groq, OpenAI, etc.)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/testvandana/VandanaAIprojects.git
cd VandanaAIprojects

# Example: Run the RAG pipeline
cd Chapter-8-RAG
pip install -r requirements.txt
python ingest_pdf.py          # Ingest & embed the PRD
python rag_server.py          # Start the RAG server
# Open index.html in your browser

# Example: Run a CrewAI agent
cd CrewAIAgents
pip install crewai python-dotenv
# Set GROQ_API_KEY in .env
python 01_Test_Analyst_Agent.py

# Example: Launch the MCP Test-Case Explorer
cd MCP-Creation
pip install fastmcp
python tc_mcp.py              # stdio mode
# or: python tc_mcp.py --transport http --host 127.0.0.1 --port 8000
```

> **Note:** Each project may have its own `.env` file requirements. Check individual project directories for `.env.template` files and set the required API keys before running.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes. Please refer to individual project directories for any specific licensing information.

---

<p align="center">
  <b>Built with ❤️ by Vandana — Exploring the intersection of AI and Software Testing</b>
</p>
