import Groq from "groq-sdk";
import 'dotenv/config';

const groq = new Groq({
  apiKey:  process.env.GROQ_API_KEY,
});

export async function connectIA(menssage: any, prompt: string){

  console.log("chamou a IA")
  try {
    const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: JSON.stringify(menssage),
      },
    ],

    temperature: 0.6,
    max_completion_tokens: 400,
    top_p: 1,
  });
  return completion.choices[0]?.message?.content;
  } catch (error) {
    console.log("erro de comunicacao com a IA: ", error)
  }
}