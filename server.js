const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 允许来自前端的跨域请求
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 静态文件服务（可选，用于直接提供前端文件）
app.use(express.static(path.join(__dirname)));

// 代理 Warframe Market API v2 请求
app.get('/api/items', async (req, res) => {
  try {
    // 从查询参数获取语言（默认为 zh-hans）
    const lang = req.query.lang || 'zh-hans';
    
    // 构建目标 API URL
    const apiUrl = `https://api.warframe.market/v2/items?include=item,i18n&language=${lang}`;
    
    // 设置请求头
    const headers = {
      'Accept': 'application/json',
      'Accept-Language': lang,
      'Platform': 'pc',
      'User-Agent': 'WarframeBilingualTool/1.0 (+https://github.com/your-username/Warframe-Chinese-English-Bilingual)'
    };
    
    // 向 Warframe Market API 发起请求
    const response = await axios.get(apiUrl, { headers });
    
    // 返回数据给前端
    res.json(response.data);
  } catch (error) {
    console.error('API 代理错误:', error.message);
    
    // 处理不同类型的错误
    if (error.response) {
      // API 返回了错误状态码
      res.status(error.response.status).json({
        error: `Warframe Market API 错误: ${error.response.status}`,
        message: error.response.data?.error || '未知错误'
      });
    } else if (error.request) {
      // 请求发出但没有收到响应
      res.status(502).json({
        error: '无法连接到 Warframe Market API',
        message: '请检查网络连接或稍后再试'
      });
    } else {
      // 其他错误
      res.status(500).json({
        error: '服务器内部错误',
        message: error.message
      });
    }
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('前端应通过此服务器访问，而非直接打开 HTML 文件');
});