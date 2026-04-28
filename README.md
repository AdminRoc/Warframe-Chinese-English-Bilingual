# Warframe-Chinese-English-Bilingual

> 一键生成 [warframe.market](https://warframe.market) 全部可交易物品的「中文 ↔ English」一一对应映射表。
> 支持类型筛选、整体导出、按勾选种类导出。

![status](https://img.shields.io/badge/status-active-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue) ![data](https://img.shields.io/badge/data-warframe.market-orange)

---

## ✨ 功能概述

- **全量获取** ~3500 个 warframe.market 上可交易物品的中英文名称（仅需 2 个网络请求）
- **类型自动分类**：Warframe / Prime 部件 / Prime 套装 / Mod / Arcane / 虚空遗物 / Requiem / Lich (Kuva) 武器 / Sister (Tenet) 武器 / 鱼类 / 宝石 / Captura 场景 / Imprint / 皮肤 / 普通武器…
- **类型勾选导出**：按物品种类自由勾选要导出的内容
- **多格式导出**：`CSV` / `TSV` / `JSON` / `Markdown`，文件保存到系统下载文件夹
- **实时搜索**：按中文或英文模糊匹配
- **统计面板**：总数 / 已选 / 类别数实时更新
- **极光风格界面**：动态背景渐变、字体渐变、玻璃毛化卡片、动画进度条
- **CSV 含 UTF-8 BOM**：Excel 双击打开不会出现中文乱码

---

## 🚀 快速开始

### 方式 A — 直接打开本地文件

1. 下载本仓库为 zip 或 `git clone`
2. 双击 `index.html`，浏览器打开
3. 选择 CORS 代理（默认 `corsproxy.io`） → 点击 **开始拉取** → 等待约 1–3 秒
4. 在「类型筛选」里勾选要保留的物品类型（默认全选）
5. 点击 **下载 CSV / TSV / JSON / Markdown**

### 方式 B — 发布为 GitHub Pages 公开链接 🌐

把本仓库部署到 `https://AdminRoc.github.io/Warframe-Chinese-English-Bilingual/` 只需一次设置：

1. 进入仓库页面 https://github.com/AdminRoc/Warframe-Chinese-English-Bilingual
2. 顶部菜单 → **Settings**
3. 左侧 → **Pages**
4. 「Build and deployment」段落：
   - **Source** 选择：`Deploy from a branch`
   - **Branch** 选择：`main` 分支，目录选 `/ (root)`
5. 点击 **Save**
6. 等 1–2 分钟，刷新该页面，会显示出公开链接：
   `https://adminroc.github.io/Warframe-Chinese-English-Bilingual/`
7. 把这个链接分享出去即可，任何人通过浏览器打开就能直接使用

> ℹ️ 之后每次你 `git push` 新版本到 `main` 分支，GitHub Pages 会自动重新部署，约 30 秒生效。

---

## 🧠 工作原理

warframe.market 的 `GET /v1/items` 端点以 HTTP `Language` header 控制返回语言。本工具向同一端点分别发送两次请求：

```http
GET https://api.warframe.market/v1/items
Language: en          →  英文物品列表
Language: zh-hans     →  简体中文物品列表
```

然后根据每个物品稳定的 slug 字段 `url_name`（如 `chroma_prime_systems`）将两份结果合并，得到 `{中文, English}` 的纯映射表。整个流程仅 2 个网络请求即可覆盖全部商品，远低于官方 3 req/s 的速率限制。

类别分类基于物品 slug + 缩略图路径的规则匹配（无需额外请求）。规则顺序定义在 `index.html` 内的 `CATEGORIES` 数组中，可自行调整。

---

## 🛡 关于 CORS

由于 warframe.market 未对任意来源开放 CORS header，**浏览器直连大概率失败 (`Failed to fetch`)**。本工具内置三个公开代理回退：

- `corsproxy.io` （**默认**）
- `allorigins.win`
- `thingproxy.freeboard.io`

这些代理仅做 GET 转发，不会传递任何凭据。如果某代理临时不可用，请切换到另一个重试。

---

## 📁 文件结构

```
.
├── index.html      # 单页应用 — 无构建步骤，浏览器打开即可
├── README.md       # 本文件
├── LICENSE         # MIT
└── .gitignore
```

---

## 🧩 技术栈

- React 18 + Babel Standalone（CDN 内联，无需 npm）
- 纯 CSS（自定义属性 + `oklch` 色彩 + `backdrop-filter` 玻璃效果 + conic-gradient 极光动画）
- Google Fonts: Manrope · Noto Sans SC · JetBrains Mono

---

## 🤝 贡献 / 反馈

欢迎在 [Issues](https://github.com/AdminRoc/Warframe-Chinese-English-Bilingual/issues) 提交建议、bug 报告或新分类规则。

---

## 📜 License

MIT — 详见 [LICENSE](./LICENSE)。

---

## ✍️ 作者 · Author

**Roc**
来自 **[CSC联盟]**

数据来源：[warframe.market](https://warframe.market) 公开 API
API v2 参考：[42bytes WFM Api v2 Documentation](https://42bytes.notion.site/WFM-Api-v2-Documentation-5d987e4aa2f74b55a80db1a09932459d)

> 本工具仅做语言映射，不写入、不读取任何账号数据。
