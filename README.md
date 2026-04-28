# Warframe-Chinese-English-Bilingual (单文件内嵌纯静态版)

> 极致精简、开箱即用的 Warframe 物品「中文 ↔ English」双语对照词典。
> **零依赖、零服务器、断网可用** —— 整个应用与所有数据全部集成在一个 `.html` 文件中。

![status](https://img.shields.io/badge/status-active-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue) ![build](https://img.shields.io/badge/build-single_file-orange)

---

## ✨ 核心特性

- **单文件开箱即用**：彻底告别复杂的 API 跨域问题（CORS）、无需搭建本地服务器、无需手动上传文件。只需双击 `index.html` 即可瞬间打开。
- **毫秒级极速响应**：数据已深度硬编码内嵌至页面中，无需任何网络等待时间，即使断网也能照常进行模糊检索。
- **丰富的导出工具链**：支持一键将当前筛选或全量数据导出为 `Excel (.xlsx)` / `CSV` / `TSV` / `JSON` / `Markdown` 格式，方便二次处理。
- **赛博极光 UI 界面**：引入深空科技感、动态光球背景、毛玻璃拟态卡片以及流光文字动画。
- **无感渲染优化**：使用 React 构建，即使拥有数千条物品数据，也能保持丝滑的滚动和输入体验。

---

## 🚀 极速使用指南

### 方式一：本地直接打开（推荐）
1. 将本项目中的 `index.html` 下载到你的电脑中。
2. 双击该文件（默认会使用你的浏览器打开）。
3. 立即开始搜索或导出数据！

### 方式二：托管至 GitHub Pages
1. 将 `index.html` 推送到你的 GitHub 仓库的 `main` 分支。
2. 在仓库的 **Settings -> Pages** 中，将 Source 设置为 `Deploy from a branch`，Branch 选择 `main`。
3. 保存后等待 1 分钟，即可通过生成的公开链接随时随地访问，方便分享给其他玩家。

---

## 🛠️ 如何更新/添加新物品数据？

本工具的数据采用**直接内嵌**的方式。如果你获取了新的中英对照数据，只需按照以下 3 步操作即可更新：

1. 使用任意文本编辑器（如记事本、VS Code）打开 `index.html`。
2. 在代码中找到以下数据源标签区域（大约在 `<body>` 标签下方）：
   ```html
   English" 的格式换行追加在下面即可 -->
   <script id="data-source" type="text/plain">
   保障·锡斯特双枪 --> Secura Dual Cestra
   匍匐靶心 --> Creeping Bullseye
   ...
   </script>