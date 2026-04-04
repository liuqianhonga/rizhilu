# 日知录 · 每日推送工作流

## 触发条件
- 每天早上 7:00（Windows 任务计划触发）
- 或心跳检查时发现 lastPushDate != 今天

## 执行步骤

### 1. 生成今日认知内容（每天两条）

**第一条：经典智慧**
- 来源：道德经、孙子兵法、易经、王阳明心学、天道
- 格式：标题 + 来源 + body（Markdown 格式） + 标签
- body 结构：
  - 开头：核心内容
  - `### 标题`：分隔不同部分（应用、局势判断等）
  - `> 引用`：金句总结
- **认知框架要求**：每条必须包含「直接行动」；「不做也 OK」仅在涉及具体操作/投资/行动建议且真的可以跳过时才写，认知/思维/哲学类内容不强加此框架

**第二条：时事热点/历史事件**
- 来源：时事热点（SearXNG 搜索）或 历史经典事件
- **内容领域扩展**：
  - 心理学/认知科学：思维偏误、决策陷阱
  - 投资大师思想：巴菲特、芒格、达利欧的原则
  - 商业案例：诺基亚衰落、苹果崛起等
  - 科学思维：第一性原理、概率思维、贝叶斯思维
  - 人物传记：曾国藩、王阳明、富兰克林等
- **步骤 1：搜索热点**
  - 用 SearXNG 搜索国际新闻：`http://192.168.9.55:5080/search?q=today world news&format=json&language=en`
  - 用 SearXNG 搜索国内新闻：`http://192.168.9.55:5080/search?q=今日热点&format=json&language=zh-CN`
- **步骤 2：过滤已分析事件**
  - 读取 `memory/analyzed-topics.json`
  - 排除已分析的热点（同一事件不同角度可以分析，但要注明新角度）
- **步骤 3：选择事件**
  - 从未分析的热点中选择最有认知价值的事件
  - 优先选择：影响广泛、有决策启发、能结合经典智慧解读的事件
- **步骤 4：分析生成**
  - 格式：标题 + 来源 + body（Markdown 格式）
  - body 结构：事件背景 + 认知框架解读 + 应对策略 + 金句
  - **认知框架要求**：每条必须包含「直接行动」；「不做也 OK」仅在涉及具体操作/投资/行动建议且真的可以跳过时才写，认知/思维/哲学类内容不强加此框架
- **步骤 5：记录已分析**
  - 将分析的事件写入 `memory/analyzed-topics.json`
  - 记录：日期、主题、事件、分析角度、对应 id

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
- 已分析热点：`memory/analyzed-topics.json`
- 每日记录：`memory/YYYY-MM-DD.md`
- 添加脚本：`scripts/daily-push.ps1`
