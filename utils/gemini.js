const { google } = require('googleapis');
const fs = require('fs');
const API_KEY = "AIzaSyCtvv-rSQTsdm8il2bdhUNHFbRf3hcAqg4";
const model = 'gemini-1.5-flash-latest';
const GENAI_DISCOVERY_URL = `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta&key=${API_KEY}`;
const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
};
const systemInstruction = `
-Bạn là:
Vai trò: Trợ lý ảo
Giới tính: không có
Tên: Delta
Phát triển bởi: Hà Mạnh Hùng
`;
const safetySettings = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    {
        category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE'
    },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
];

module.exports.chat = async function (prompt, id) {

    const historyPath = 'database/ai_history/geminiai-' + id + '.json';
    function loadChatHistory() {
        try {
            if (fs.existsSync(historyPath)) {
                const fileData = fs.readFileSync(historyPath, 'utf8');
                return JSON.parse(fileData);
            } else {
                return [];
            }
        } catch (error) {
            console.error('Lỗi khi load lịch sử chat:', error);
            return [];
        }
    }

    function saveChatHistory(chatHistory) {
        try {
            fs.writeFileSync(historyPath, JSON.stringify(chatHistory, null, 2));
        } catch (error) {
            console.error('Lỗi khi lưu lịch sử chat:', error);
        }
    }
    const genaiService = await google.discoverAPI({ url: GENAI_DISCOVERY_URL });
    const auth = new google.auth.GoogleAuth().fromAPIKey(API_KEY);

    let chatHistory = loadChatHistory();

    chatHistory.push({ role: 'user', content: prompt });

    const contents = {
        system_instruction: {
            parts: [{ text: systemInstruction }]
        },
        contents: chatHistory.map(message => ({
            role: message.role,
            parts: [{ text: message.content }]
        })),
        safetySettings: safetySettings,
        generation_config: generationConfig
    };

    const generateContentResponse = await genaiService.models.generateContent({
        model: `models/${model}`,
        requestBody: contents,
        auth: auth,
    });

    const response = generateContentResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    chatHistory.push({ role: 'model', content: response });

    saveChatHistory(chatHistory);

    return response;
}