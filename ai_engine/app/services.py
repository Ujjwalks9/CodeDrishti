import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.models import AnalysisResponse

load_dotenv()

# CONFIGURATION FOR FREE GEMINI API
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",  # Fast, Free, and 1M Context Window
    temperature=0.1,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    convert_system_message_to_human=True # specific fix for some Gemini versions
)

# Set up the parser based on Pydantic model
parser = JsonOutputParser(pydantic_object=AnalysisResponse)

def analyze_code(code: str, language: str) -> dict:
    """
    Orchestrates the AI analysis using Google Gemini 1.5 Flash (Free Tier).
    """
    
    system_prompt = """
    You are a Senior Principal Software Engineer and QA Architect.
    Analyze the provided {language} code.
    
    Perform the following tasks simultaneously:
    1. **Code Review**: Identify bugs, security flaws (OWASP), and performance issues.
    2. **Documentation**: Generate a summary and Javadoc/Docstring.
    3. **QA/Testing**: Write Unit Tests (JUnit/PyTest) and list edge cases.
    4. **Scoring**: Rate the code 0-100 based on clean code principles.

    You MUST output valid JSON matching the exact schema below.
    You must output ONLY valid JSON. No backticks, no markdown, no code blocks, no comments.
    Every string must be escaped properly.

    No multiline strings (convert all newlines to \n).

    No backticks anywhere in the output.

    No "...```java..." or code fences inside description fields.
    {format_instructions}
    """

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", "Analyze this code:\n\n{code}")
    ])

    chain = prompt | llm | parser

    try:
        result = chain.invoke({
            "language": language, 
            "code": code,
            "format_instructions": parser.get_format_instructions()
        })
        return result
    except Exception as e:
        print(f"Gemini AI Error: {e}")
        raise e