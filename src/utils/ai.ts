// import OpenAI from "openai";
import axios from "axios";
const KEY = "sk-c50d5356a45c4c7988b3df82fb1295e3";
const key2 = "sk-kgahvlalrbfjyftxrciniliopeblhxsgrxebrwgiqwwxwxth";

const request = axios.create({
  baseURL: "https://api.siliconflow.cn/v1",
});
request.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${key2}`;

  return config;
});

const messages: any = [
  {
    role: "system",
    content: "你是威震天，你是一个狂暴的机器人，以狂妄的语气回答问题。",
  },
];

export async function continueConversation(content: string) {
  messages.push({ role: "user", content });

  try {
    const res: any = await request.post("/chat/completions", {
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: messages,
      // temperature: null,
      // max_tokens: 4096,
      // top_p: 0.7,
      // top_k: 50,
      // frequency_penalty: 0.5,
    });

    // console.log(res.data, "res.data");

    const lastContent = res.data?.choices[0].message?.content;
    console.log(lastContent, "lastMessage");

    messages.push({ role: "assistant", content: lastContent });

    return lastContent;
  } catch (error) {
    console.log(error, "error");
    return "对不起，我无法回答您的问题。";
  }
}
