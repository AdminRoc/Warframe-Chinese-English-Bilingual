# Warframe-Chinese-English-Bilingual (单文件纯静态版)

> 极致精简、开箱即用的 Warframe 物品「中文 ↔ English」双语对照词典。
> **零依赖、零服务器、完全断网可用** —— 整个应用与接近 4000 条物品数据全部集成在一个 `.html` 文件中。

![status](https://img.shields.io/badge/status-active-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue) ![build](https://img.shields.io/badge/build-single_file-orange)

---

## ✨ 核心特性

- **单文件开箱即用**：无需手动上传文件。只需双击 `index.html` 即可瞬间打开！
- **毫秒级极速响应**：近 4000 条双语对照数据已硬编码内嵌至页面中，无需任何网络加载等待时间，即使在完全断网的环境下也能照常进行模糊检索。
- **全量无感渲染**：取消了分页与截断限制，3790+ 条数据同屏直出，配合丝滑的自定义滚动条，浏览体验极佳。
- **丰富的导出工具链**：支持一键将当前筛选结果或全量数据导出为 `Excel (.xlsx)` / `CSV` / `TSV` / `JSON` / `Markdown` 格式。
- **美观的 UI 界面**：大家可以随意取用。

---

## 🚀 极速使用指南

### 方式一：本地直接打开（实际上就那么一个文件而已）
1. 从本仓库下载 `index.html` 文件到你的电脑。
2. 双击该文件（默认会使用你的浏览器打开）。
3. 立即开始搜索或导出数据！

### 方式二：Clone之后托管至 GitHub Pages（其实没有必要，一共就一个文件）
1. 将项目Clone。
2. 在仓库的 **Settings -> Pages** 中，将 Source 设置为 `Deploy from a branch`，Branch 选择 `main`。
3. 保存后等待 1 分钟，即可通过生成的公开链接随时随地访问，方便分享给其他玩家。

---

## 🛠️ 如何更新或维护数据？

静态页面的数据都是**内嵌的 Script 标签**，严格按照行号一一对应（实际上用api全量获取，不故意排序之前，顺序都是这样的，相同item的id字段相同）。如果你未来获取了新的 `items_zh-hans.txt` 和 `items_en.txt`，只需按照以下步骤更新：

1. 使用任意文本编辑器（如 VS Code、Notepad++）打开 `index.html`。
2. 找到代码中的数据插槽区域（位于 `<body>` 标签下方）：

   ```html
   <script id="data-zh" type="text/plain">
   保障·锡斯特双枪
   匍匐靶心
   ...
   </script>
   
   <script id="data-en" type="text/plain">
   Secura Dual Cestra
   Creeping Bullseye
   ...
   </script>

3.将你最新的中文文本和英文文本分别完全覆盖粘贴进对应的 <script> 标签内。
4.保存文件，刷新页面即可生效。系统会自动过滤掉多余的换行或大模型生成的 `` 等杂乱标记，保证表格纯净。

---

## 🧩 技术栈

- 框架：React 18 + Babel Standalone (CDN 直引，无需 npm/Node.js)

- 数据导出：SheetJS (xlsx) (CDN 直引)

- 样式：纯原生 CSS (CSS 变量 + 动态模糊滤镜 + 渐变遮罩)

- 字体：Orbitron (英文展示) / Noto Sans SC (中文字体)

---

## 📜 License

本项目采用 MIT License 开源协议。

---

## ✍️ 作者与鸣谢

作者: [Roc](https://space.bilibili.com/91933543)

所属: [CSC联盟](http://csc.war-frame.com)

数据支撑: 基于 Warframe.market 历史字典数据提取转换。

交易建议: [点击获取交易建议](http://roc.war-frame.com)

---

💡 最后留言：（实际上根本没有留言）
