const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(express.json());

// 允許您的前端網站來源 (請在部署後將 * 改為您的網址以增加安全性)
app.use(cors({
    origin: '*', 
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

// 注意：API_KEY 將在 Render 平台設定，這裡不會直接寫入
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/api/analyze', async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (error) {
        console.error("AI 呼叫失敗:", error);
        res.status(500).json({ error: "伺服器處理失敗" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`後端已在 Port ${PORT} 啟動`));