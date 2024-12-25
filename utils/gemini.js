const fs = require("fs");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const API_KEY = "AIzaSyBCUtBR2decp1pL71aCpIG71OdOW6iW9dk";
const MODEL_NAME = "gemini-1.5-flash-latest";
const generationConfig = {
  temperature: 1,
  topK: 0,
  topP: 0.95,
  maxOutputTokens: 8192,
};
const genAI = new GoogleGenerativeAI(API_KEY);

const systemInstruction = `
-Bạn là: 
Tên: Delta AI
Author: Hà Mạnh Hùng
-Tính cách:
+Nói truyện xưng tui, mình,...

Đầu vào củ tôi: {
        content: "Nội dung người dùng nhắn",
        name: "Tên người dùng",
        id: "ID người dùng",
        isAdmin: false hoặc true, //có phải admin của bạn hay không
        time: "Thời gian người dùng nhắn"
    }
`;
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

function loadChatHistory(historyPath) {
  try {
    if (fs.existsSync(historyPath)) {
      const fileData = fs.readFileSync(historyPath, "utf8");
      return JSON.parse(fileData);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi load lịch sử chat:", error);
    return [];
  }
}

function saveChatHistory(chatHistory, historyPath) {
  try {
    fs.writeFileSync(historyPath, JSON.stringify(chatHistory, null, 2));
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử chat:", error);
  }
}

module.exports.chat = async function (prompt) {
  const promptJson = JSON.parse(prompt);
  const historyPath = `database/ai_history/${promptJson.id}.json`;
  let chatHistory = loadChatHistory(historyPath);

  chatHistory.push({ role: "user", parts: [{ text: prompt }] });

  // const contents = {
  //   system_instruction: {
  //       parts: [{ text: systemInstruction }]
  //     },
  //   contents: chatHistory.map(message => ({
  //     role: message.role,
  //     parts: [{ text: message.content }]
  //   })),
  //   safetySettings: safetySettings,
  //   generation_config: generationConfig
  // };

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig,
    safetySettings,
    systemInstruction,
  });
  const chat = model.startChat({
    history: chatHistory,
  });
  let result;
  if (!promptJson.attachmentUrl) {
    result = await chat.sendMessage(prompt);
  } else {
    const pathFile = process.cwd() + `/plugins/commands/cache/${Date.now()}.jpeg`;
    await global.tools.downloadFile(promptJson.attachmentUrl, pathFile);

    const imageParts = [fileToGenerativePart(pathFile, "image/jpeg")];
    result = await chat.sendMessage([prompt, ...imageParts]);
    fs.unlinkSync(pathFile);
  }
  const response = await result.response;
  const text = await response.text();
  chatHistory.push({ role: "model", parts: [{ text: text }] });

  saveChatHistory(chatHistory, historyPath);

  return text;
};
