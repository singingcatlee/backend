// ... existing code ...
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// 開放所有網域連線 (讓您的 GitHub Pages 可以順利呼叫)
app.use(cors());
app.use(express.json());

// 💡 核心關鍵：將您的專屬 AQ. 金鑰直接設定在這裡 (或者從環境變數讀取)
// 這樣前端訪客就絕對不需要輸入任何東西！
const MY_API_KEY = process.env.API_KEY || "AQ.Ab8RN6KobzPptmJKH62QFa1EIPAB6Sz2TE_45vWwTafHwnmmdQ";

// 初始化 Google AI SDK
const genAI = new GoogleGenerativeAI(MY_API_KEY);

app.post('/api/analyze', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "缺少 prompt 內容" });
        }

        // 使用最穩定且支援新金鑰的 flash 模型
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log("正在向 Google 請求分析...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("分析成功，回傳給前端訪客！");
        res.json({ text: text });
    } catch (error) {
        console.error("AI 呼叫失敗，詳細錯誤原因:", error);
        res.status(500).json({ error: error.message || "伺服器處理失敗" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`伺服器已啟動，正在監聽 Port ${PORT}`);
    console.log(`已成功載入 AI 金鑰，準備為訪客提供服務！`);
});
