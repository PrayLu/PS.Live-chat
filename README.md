# BEARING — 个人战略咨询师

纯前端移动端 Web 应用：战略深潜访谈 → 豆包对话 → 战略诊断报告。

## 在线访问

部署 GitHub Pages 后访问：

```
https://<你的用户名>.github.io/PS-live-chat/
```

## 功能概览

- **封面页** → **模式选择**（战略深潜 / 豆包语音交流）
- **13 题语音深潜**（本地自动保存进度，可断点续答）
- **豆包智能体**：[个人战略咨询师](https://doubao.com/bot/XV8wCfJW)
- **对话纪要** → 提交分析 → **DeepSeek AI 自动生成战略报告**
- 失败时可降级：跳转豆包手动生成 / 手动粘贴报告
- **历史报告**（localStorage 本地存储）

## DeepSeek API 配置

API Key 配置在 `js/config.js` → `APP_CONFIG.DEEPSEEK_API_KEY`

诊断提示词：`docs/diagnosis-prompt.md`（源自《案例：诊断+解法（极速版）》）

## 本地预览

```bash
cd PS-live-chat
python3 -m http.server 8080
```

浏览器打开：http://localhost:8080

## 部署到 GitHub Pages

### 1. 创建仓库并推送

```bash
git init
git add .
git commit -m "feat: BEARING 个人战略咨询师上线"
git branch -M main
git remote add origin https://github.com/<你的用户名>/PS-live-chat.git
git push -u origin main
```

### 2. 开启 GitHub Pages

1. **Settings → Pages → Build and deployment**
2. **Source** 选择 `GitHub Actions`（推荐），或 `Deploy from a branch` + `main` / root
3. push 到 `main` 后自动部署

### 3. 验证

- 封面 `#cover` 可正常打开
- 战略深潜流程可走通
- 豆包链接可跳转（微信内需复制链接）
- 刷新页面不会丢失当前路由

## 技术说明

- 无后端，数据存 `localStorage`
- Hash 路由（`#cover`、`#landing`、`#question` 等）
- 静态资源使用相对路径，兼容 GitHub Pages 子路径

## 目录结构

```
PS-live-chat/
├── index.html      # 入口
├── css/style.css   # 样式
├── js/app.js       # 逻辑
├── docs/           # PRD / UIUX 文档
└── README.md
```
