# 日知录 · 每日推送工作流

## 触发条件
- 每天早上 7:00（Windows 任务计划触发）
- 或心跳检查时发现 lastPushDate != 今天

## 执行步骤

### 1. 生成今日认知内容（每天两条）

**第一条：经典智慧**
- 来源：道德经、孙子兵法、易经等传统经典
- 格式：标题 + 来源 + 内容 + 应用 + 金句 + 标签
- 风格：经典智慧 + 现代应用，简短金句形式

**第二条：时事热点**
- 内容：当下热点事件分析
- 格式：事件背景 + 认知框架解读 + 应对策略 + 金句
- **认知框架要求**：每条建议必须包含两部分：
  - **直接行动** → 具体怎么做（买什么/问谁/查什么/比例多少）
  - **不做也OK** → 什么情况下这条跟你无关，不用焦虑
- 标签：时事热点 + 相关领域标签

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