# 日知录 · 每日推送工作流

## 触发条件
- 每天早上 7:00（Windows 任务计划触发）
- 或心跳检查时发现 lastPushDate != 今天

## 执行步骤

### 1. 生成今日认知内容
- 从领域池随机选取主题：易经、道德经、孙子兵法、历史、哲学、中医、紫微斗数、投资、心理学、思维模型、AI、财富自由、副业变现
- 格式：标题 + 来源 + 内容 + 应用 + 金句 + 标签
- 风格：经典智慧 + 现代应用，简短金句形式

### 2. 推送给 TT
- 渠道：Telegram
- 格式：
  ```
  🧠 今日认知 · #序号

  **"标题"** ——来源

  内容正文

  **应用：** 现实场景应用

  **一句话：** 金句总结
  ```

### 3. 更新本地数据
- 运行 `scripts/add-cognitive.ps1` 更新 `rizhilu/data.json`
- 或直接写入 data.json

### 4. 推送到 GitHub
```powershell
cd C:\Users\Administrator\.openclaw\workspace-selfimprove\rizhilu
git add .
git commit -m "每日认知更新 - $(Get-Date -Format 'yyyy-MM-dd')"
git push
```

### 5. 更新状态
- 更新 `memory/cognitive-push-state.json` 的 lastPushDate 为今天
- 记录到 `memory/YYYY-MM-DD.md`

## 文件路径
- 数据文件：`rizhilu/data.json`
- 推送状态：`memory/cognitive-push-state.json`
- 每日记录：`memory/YYYY-MM-DD.md`
- 添加脚本：`scripts/add-cognitive.ps1`