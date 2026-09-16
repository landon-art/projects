from agents import Agent, Runner, WebSearchTool, ModelSettings
from openai.types.shared import Reasoning

BOUNDARY = open("boundary.txt").read()

chief = Agent(
    name="Chief of Staff",
    model="gpt-6-astra",
    instructions="""You are the single entry point to my agent roster. You dispatch work to
specialists and return one summary. Never do specialist work yourself.
Never hand me raw output. If two agents disagree, resolve it and tell me
what the disagreement was.""" + "\n\n" + BOUNDARY,
    model_settings=ModelSettings(reasoning=Reasoning(effort="low")),
)

if __name__ == "__main__":
    result = Runner.run_sync(chief, "Hello, introduce yourself")
    print(result.final_output)
