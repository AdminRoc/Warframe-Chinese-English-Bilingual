const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// 全局变量存储预加载的数据
let preloadedData = null;
let preloadStatus = 'idle'; // idle, loading, ready, error

// 数据文件目录
const DATA_DIR = path.join(__dirname, 'data');

// 允许来自前端的跨域请求
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 静态文件服务（可选，用于直接提供前端文件）
app.use(express.static(path.join(__dirname)));

// 预加载完整数据函数
async function preloadFullData() {
  if (preloadStatus === 'loading') return; // 避免重复加载
  
  preloadStatus = 'loading';
  console.log('开始预加载 Warframe Market 完整物品数据...');
  
  try {
    // 获取英文数据
    const enResponse = await axios.get('https://api.warframe.market/v2/items?include=item,i18n', {
      headers: {
        'Accept': 'application/json',
        'Language': 'en',
        'Platform': 'pc',
        'User-Agent': 'WarframeBilingualTool/1.0 (+https://github.com/AdminRoc/Warframe-Chinese-English-Bilingual)'
      }
    });
    
    // 获取中文数据
    const zhResponse = await axios.get('https://api.warframe.market/v2/items?include=item,i18n', {
      headers: {
        'Accept': 'application/json',
        'Language': 'zh-hans',
        'Platform': 'pc',
        'User-Agent': 'WarframeBilingualTool/1.0 (+https://github.com/AdminRoc/Warframe-Chinese-English-Bilingual)'
      }
    });
    
    const enItems = enResponse.data.payload.items || [];
    const zhItems = zhResponse.data.payload.items || [];
    
    // 创建URL名称到物品的映射
    const enMap = new Map();
    const zhMap = new Map();
    
    for (const item of enItems) {
      if (item.url_name) {
        enMap.set(item.url_name, {
          id: item.id || item._id,
          url_name: item.url_name,
          en_name: item.i18n?.en?.item_name || item.i18n?.en?.name || item.item_name || item.name || '',
          thumb: item.thumb || item.icon || ''
        });
      }
    }
    
    for (const item of zhItems) {
      if (item.url_name) {
        zhMap.set(item.url_name, {
          zh_name: item.i18n?.['zh-hans']?.item_name || item.i18n?.['zh-hans']?.name || ''
        });
      }
    }
    
    // 合并数据
    const merged = [];
    for (const [urlName, enData] of enMap.entries()) {
      const zhData = zhMap.get(urlName);
      if (enData.en_name && zhData?.zh_name) {
        merged.push({
          url_name: urlName,
          en: enData.en_name,
          zh: zhData.zh_name,
          cat: classify(urlName, enData.thumb)
        });
      }
    }
    
    // 按中文名排序
    merged.sort((a, b) => (a.zh || a.en).localeCompare(b.zh || b.en, 'zh-Hans-CN'));
    
    preloadedData = merged;
    
    // 创建数据目录
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // 按类别拆分数据并保存到文件
    const categories = {};
    for (const item of merged) {
      if (!categories[item.cat]) {
        categories[item.cat] = [];
      }
      categories[item.cat].push(item);
    }
    
    // 保存每个类别的数据到单独文件
    for (const [catId, items] of Object.entries(categories)) {
      const filePath = path.join(DATA_DIR, `${catId}.json`);
      await fs.writeFile(filePath, JSON.stringify(items, null, 2));
    }
    
    // 保存完整数据文件
    await fs.writeFile(path.join(DATA_DIR, 'all.json'), JSON.stringify(merged, null, 2));
    
    preloadStatus = 'ready';
    console.log(`预加载完成: ${merged.length} 个完整项目，已保存到 ${DATA_DIR}`);
  } catch (error) {
    console.error('预加载数据失败:', error.message);
    preloadStatus = 'error';
  }
}

// 分类函数（与前端保持一致）
function classify(slug, thumb) {
  const CATEGORIES = [
    { id: 'prime_set',    rule: (slug) => /_prime_set$/.test(slug) },
    { id: 'prime_part',   rule: (slug) => /_prime_/.test(slug) && /(blueprint|chassis|systems|neuroptics|carapace|cerebrum|wings|harness|stock|barrel|receiver|grip|blade|handle|disc|head|string|gauntlet|ornament|link|lower_limb|upper_limb)/.test(slug) },
    { id: 'warframe_set', rule: (slug) => /^(ash|atlas|baruuk|banshee|caliban|chroma|citrine|dagath|dante|ember|equinox|excalibur|frost|gara|garuda|gauss|grendel|gyre|harrow|hildryn|hydroid|inaros|ivara|khora|kullervo|lavos|limbo|loki|mag|mesa|mirage|nekros|nezha|nidus|nova|nyx|oberon|octavia|protea|qorvex|revenant|rhino|saryn|sevagoth|styanax|titania|trinity|valkyr|vauban|volt|voruna|wisp|wukong|xaku|yareli|zephyr)_set$/.test(slug) },
    { id: 'warframe',     rule: (slug, thumb) => /\/warframes\//.test(thumb) },
    { id: 'mod',          rule: (slug, thumb) => /\/mods\//.test(thumb) || /(_mod)$/.test(slug) },
    { id: 'arcane',       rule: (slug, thumb) => /\/arcanes?\//.test(thumb) || /^(arcane_|magus_|virtuos_|exodia_|theorem_|cascadia_)/.test(slug) || /_arcane$/.test(slug) },
    { id: 'relic',        rule: (slug, thumb) => /\/relics?\//.test(thumb) || /^(lith|meso|neo|axi|requiem)_[a-z0-9]+_relic$/.test(slug) },
    { id: 'requiem',      rule: (slug) => /^(fass|jahu|khra|lohk|netra|ris|vome|xata)$/.test(slug) },
    { id: 'lich_weapon',  rule: (slug) => /^kuva_/.test(slug) },
    { id: 'sister_weapon',rule: (slug) => /^tenet_/.test(slug) },
    { id: 'fish',         rule: (slug, thumb) => /\/fish\//.test(thumb) },
    { id: 'gem',          rule: (slug, thumb) => /\/(gems|resources)\//.test(thumb) },
    { id: 'captura',      rule: (slug, thumb) => /captura/.test(slug) || /\/captura/.test(thumb) },
    { id: 'imprint',      rule: (slug) => /_imprint$/.test(slug) },
    { id: 'skin',         rule: (slug, thumb) => /\/skins?\//.test(thumb) || /(_skin|_helmet|_armor|_syandana|_sigil)$/.test(slug) },
    { id: 'weapon',       rule: () => true },
  ];
  
  for (const cat of CATEGORIES) {
    try { 
      if (cat.rule(slug, thumb || '')) return cat.id; 
    } catch {}
  }
  return 'weapon';
}

// 新增：提供预加载的静态数据
app.get('/api/static-data', (req, res) => {
  if (preloadStatus === 'error') {
    return res.status(500).json({ error: '预加载数据失败，请重启服务器' });
  }
  
  if (preloadStatus === 'loading') {
    return res.status(503).json({ error: '数据正在加载中，请稍后再试' });
  }
  
  if (preloadStatus === 'idle') {
    // 如果还没开始加载，立即开始加载
    preloadFullData();
    return res.status(503).json({ error: '数据正在加载中，请稍后再试' });
  }
  
  // preloadStatus === 'ready'
  res.json({ data: preloadedData });
});

// 新增：提供所有类别数据
app.get('/api/categories', async (req, res) => {
  if (preloadStatus === 'error') {
    return res.status(500).json({ error: '预加载数据失败，请重启服务器' });
  }
  
  if (preloadStatus === 'loading') {
    return res.status(503).json({ error: '数据正在加载中，请稍后再试' });
  }
  
  if (preloadStatus === 'idle') {
    // 如果还没开始加载，立即开始加载
    preloadFullData();
    return res.status(503).json({ error: '数据正在加载中，请稍后再试' });
  }
  
  try {
    // 读取所有类别文件
    const files = await fs.readdir(DATA_DIR);
    const categoryFiles = files.filter(file => file.endsWith('.json') && file !== 'all.json');
    
    const categories = {};
    for (const file of categoryFiles) {
      const catId = file.replace('.json', '');
      const filePath = path.join(DATA_DIR, file);
      const data = await fs.readFile(filePath, 'utf8');
      categories[catId] = JSON.parse(data);
    }
    
    res.json({ categories });
  } catch (error) {
    console.error('读取类别数据失败:', error.message);
    res.status(500).json({ error: '读取数据文件失败' });
  }
});

// 新增：提供特定类别数据
app.get('/api/category/:id', async (req, res) => {
  const { id } = req.params;
  
  if (preloadStatus === 'error') {
    return res.status(500).json({ error: '预加载数据失败，请重启服务器' });
  }
  
  if (preloadStatus === 'loading') {
    return res.status(503).json({ error: '数据正在加载中，请稍后再试' });
  }
  
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: '类别不存在' });
    } else {
      console.error('读取类别数据失败:', error.message);
      res.status(500).json({ error: '读取数据文件失败' });
    }
  }
});

// 原有的代理 API（保留但不再使用）
app.get('/api/items', async (req, res) => {
  try {
    // 从查询参数获取语言（默认为 zh-hans）
    const lang = req.query.lang || 'zh-hans';
    
    // 验证语言参数
    const validLangs = ['en', 'zh-hans', 'zh', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'tr', 'uk'];
    if (!validLangs.includes(lang)) {
      return res.status(400).json({
        error: '无效的语言参数',
        message: `支持的语言: ${validLangs.join(', ')}`
      });
    }
    
    // 构建目标 API URL
    const apiUrl = `https://api.warframe.market/v2/items?include=item,i18n`;
    
    // 设置请求头 - 修复: 使用 Language 头而不是 Accept-Language
    const headers = {
      'Accept': 'application/json',
      'Language': lang, // 修改这里：使用 Language 头
      'Platform': 'pc',
      'User-Agent': 'WarframeBilingualTool/1.0 (+https://github.com/AdminRoc/Warframe-Chinese-English-Bilingual)'
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

// 启动服务器时预加载数据
preloadFullData();

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('请在浏览器中访问 http://localhost:3000 查看应用');
  console.log('数据预加载状态:', preloadStatus);
});