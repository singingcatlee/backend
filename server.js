const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(express.json());

// 允許來自所有網域的請求
app.use(cors({
    origin: '*', 
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

// 初始化 Google AI SDK (完美支援新版 AQ. 格式金鑰)
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

app.post('/api/analyze', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "缺少 prompt 內容" });
        }

        // 強制檢查：確認 Render 真的有讀取到您的 AQ. 金鑰
        if (!process.env.API_KEY) {
            console.error("警告：Render 沒有讀取到 API_KEY 環境變數！");
            throw new Error("伺服器未設定 API 金鑰，請至 Render 後台設定。");
        }

        // 使用最穩定且支援新金鑰的模型
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });
    } catch (error) {
        console.error("AI 呼叫失敗，詳細錯誤原因:", error);
        res.status(500).json({ error: error.message || "伺服器處理失敗" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`後端已在 Port ${PORT} 啟動`));
