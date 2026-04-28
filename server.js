import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'items_data.json');

app.use(cors()); // 允许前端跨域访问

// 从官方 API 拉取数据的核心逻辑
async function fetchAndSaveData() {
    console.log("⏳ 开始从 Warframe.market V2 API 拉取全量数据...");
    try {
        const response = await fetch('https://api.warframe.market/v2/items', {
            headers: {
                'Accept': 'application/json',
                'Language': 'en', // V2 无论传什么，都会返回 i18n 完整节点
                'Platform': 'pc'
            }
        });

        if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
        
        const json = await response.json();
        const items = json.data || [];
        const rows = [];

        for (const it of items) {
            const slug = it.slug || it.id;
            const i18n = it.i18n || {};
            
            // 提取中文和英文
            let zh = i18n['zh-hans']?.name || i18n['zh']?.name || '';
            let en = i18n['en']?.name || slug;

            if (zh && en) {
                rows.push({ zh, en });
            }
        }

        // 按照中文拼音排序
        rows.sort((a, b) => a.zh.localeCompare(b.zh, 'zh-Hans-CN'));

        // 将结果保存到本地文件
        await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2));
        console.log(`✅ 成功拉取并存储 ${rows.length} 条中英对照数据！`);
        return rows;
    } catch (error) {
        console.error("❌ 获取数据时出错:", error);
        throw error;
    }
}

// 服务启动时初始化数据
async function init() {
    try {
        await fs.access(DATA_FILE);
        console.log("📂 本地数据文件已存在，前端可直接读取。");
    } catch (error) {
        console.log("⚠️ 找不到本地数据文件，系统将执行初次拉取（这可能需要几秒钟）...");
        await fetchAndSaveData();
    }
}

// 接口：前端获取数据 (直接读取本地文件，极速响应)
app.get('/api/items', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: "服务器内部错误，无法读取数据表" });
    }
});

// 接口：强制更新数据
app.post('/api/update', async (req, res) => {
    try {
        const newData = await fetchAndSaveData();
        res.json({ message: "数据更新成功", count: newData.length });
    } catch (error) {
        res.status(500).json({ error: "数据更新失败" });
    }
});

app.listen(PORT, async () => {
    console.log(`🚀 后端服务器已启动: http://localhost:${PORT}`);
    await init();
});