const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey:
    "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",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

app.post("/", async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct",
      messages: req.body.messages,
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    for await (const chunk of completion) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.end();
  } catch (error) {
    console.error("Error:", error);
    res.write(
      `data: ${JSON.stringify({ error: "Internal Server Error" })}\n\n`
    );
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
