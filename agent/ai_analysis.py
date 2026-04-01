import json
import os

from groq import Groq


SYSTEM_PROMPT = """You are an AI Risk Assessment Engine for a Parametric Insurance platform serving platform-based gig delivery workers in India.

Your task is to analyze daily news feeds for specific regions and determine if external disruptions (like extreme weather, pollution, or social unrest) are severe enough to cause a massive loss of working hours and income for that day.

CRITICAL CONSTRAINTS:
1. You must only evaluate the risk of INCOME LOSS due to inability to work.
2. Strictly ignore news about vehicle repairs, health issues, or accidents.
3. Your threshold for a disruption day is a confidence score of 0.55 or higher.

OUTPUT FORMAT:
You must output ONLY a valid JSON object. Do not include markdown formatting or conversational text. The JSON must follow this exact schema for every date and region provided in the input:

{
  "evaluations": [
    {
      "date": "YYYY-MM-DD",
      "region_assessments": {
        "CityName": {
          "confidence_score": 0.0,
          "is_disruption": true/false,
          "reasoning": "A concise 1-sentence justification based on the news."
        }
      }
    }
  ]
}"""


def format_news_context(data):
    context = f"Batch ID: {data['batch_id']}\n"
    context += f"Active Regions: {', '.join(data['active_regions'])}\n\n"

    for payload in data["daily_news_payloads"]:
        context += f"Date: {payload['date']}\n"
        context += "-" * 50 + "\n"
        for region, news_list in payload["news"].items():
            context += f"\n{region}:\n"
            for news in news_list:
                context += f"  Title: {news['title']}\n"
                context += f"  Description: {news['description']}\n"
        context += "\n"

    return context


def AI_analysis():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set.")

    client = Groq(api_key=api_key)

    with open("mock_news.json", "r", encoding="utf-8") as f:
        news_data = json.load(f)

    news_context = format_news_context(news_data)
    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": (
                "Process the following news data and output the required JSON "
                f"evaluation:\n\n{news_context}"
            ),
        },
    ]

    print("Sending data to Groq for assessment...")

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        max_tokens=2048,
        temperature=0.2,
        response_format={"type": "json_object"},
    )

    raw_ai_output = response.choices[0].message.content

    print("\n=== AI Assessment Complete ===")

    try:
        assessed_data = json.loads(raw_ai_output)
        print("\nSuccessfully parsed JSON! Here is a sample of the logic:")

        disruption_tally = {"Chennai": 0, "Bengaluru": 0, "Mumbai": 0}

        for day in assessed_data.get("evaluations", []):
            for region, assessment in day.get("region_assessments", {}).items():
                if assessment.get("is_disruption") is True and region in disruption_tally:
                    disruption_tally[region] += 1

        print(f"Weekly Disruption Tally: {disruption_tally}")
        return assessed_data

    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON. Error: {e}")
        print("Raw output was:\n", raw_ai_output)
        return None


if __name__ == "__main__":
    AI_analysis()
