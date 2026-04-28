# Warframe-Chinese-English-Bilingual (前后端极速版)

> 本项目是一个用于生成并展示 [warframe.market](https://warframe.market) 物品「中文 ↔ English」一一对应关系表的全栈应用。
> 采用赛博朋克深色 UI，极致的搜索体验，并且摒弃了每次加载都要请求外部 API 的负担。

![status](https://img.shields.io/badge/status-active-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue) ![data](https://img.shields.io/badge/data-warframe.market-orange)

## ✨ 最新特性 (重构升级版)

1. **前后端分离架构**：由 Node.js 后端接管数据抓取工作。
2. **本地文件缓存**：后端启动时会自动拉取 V2 API 数据并保存为本地 JSON 表。前端直接读取本地文件，**实现毫秒级加载与零外部网络负担**。
3. **极简纯净的数据映射**：放弃复杂的分类逻辑，左侧中文，右侧英文，严格一一对应。
4. **炫酷的 UI 界面**：引入全新的赛博朋克动态流光 UI、毛玻璃效果和绝美动画。
5. **按需更新**：前端保留了“强制更新数据”按钮，只有在用户主动请求时，后端才会去重抓 Warframe.market 的 API 更新本地表。

## 🚀 部署与运行指南

### 1. 准备环境
请确保你的电脑上已经安装了 [Node.js](https://nodejs.org/) (建议版本 18 或以上)。

### 2. 初始化后端项目
在项目根目录下，打开终端 (Terminal 或 CMD)，运行以下命令安装依赖：

```bash
npm install express cors