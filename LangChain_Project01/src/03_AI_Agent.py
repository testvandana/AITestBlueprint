from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tools import tool
from langchain_classic.agents import create_tool_calling_agent
from langchain_classic.agents import AgentExecutor
import os

load_dotenv()

llm= ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY"), 
    temperature=0
    )


@tool
def get_test_history(test_id: str) -> str:

    """ Return the recent pass or fail test by given test_id. """

    fake_db = {
        "TC-101": "Pass, Fail, Pass, Fail, Pass",
        "TC-102": "Pass, Pass, Pass, Pass, Pass",     
    }

    return fake_db.get(test_id, "No test history found for the given test_id.")

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a QA Assistant. Use tools when your need data"),
    ("human","{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

tools = [get_test_history]

agent = create_tool_calling_agent(llm, tools, prompt)

executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

executor.invoke({"input": "Is the test case TC-102 flaky?}"})


