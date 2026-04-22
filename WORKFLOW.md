# 日知录工作流

## 概述

日知录内容每天自动推送到 GitHub Pages，支持以下功能：

- 按日期分文件存储（`data/YYYY-MM-DD.json`）
- 轻量索引（`dates.json`）
- 前端按需加载（每次加载 5 天）

## 每日推送流程

### 1. 获取市场数据

```bash
node get_market_data.js
```

### 2. 获取并筛选时事热点新闻

**新闻搜索**（优先使用 Al Jazeera、AP News）：
```bash
node get_news.js          # 测试，输出到控制台
```

或直接 web_search / web_fetch 获取。

**⚠️ 新闻日期校验（必须）**：
- 只选**当天或昨天**的新闻
- 最多选**2-3天内**的，绝不能选超过3天前的旧闻
- 写内容前先确认每条新闻的发布日期

### 3. 创建当日数据文件

在 `data/` 目录下创建当日文件：

```bash
# 例如：2026-04-20.json
data/2026-04-20.json
```

文件格式：
```json
[
  {
    "id": "2026-04-20_01",
    "date": "2026-04-20",
    "title": "文章标题",
    "source": "日知录",
    "category": "时事热点",
    "tags": ["标签1", "标签2"],
    "body": "文章正文（Markdown格式）...",
    "references": [
      { "title": "参考标题", "url": "https://..." }
    ]
  },
  {
    "id": "2026-04-20_02",
    ...
  }
]
```

### 4. 更新日期索引

推送前更新 `dates.json`，在 `dates` 数组开头插入新日期：

```json
{
  "dates": [
    "2026-04-20",  // 新日期插在最前面
    "2026-04-19",
    ...
  ],
  "lastUpdated": "2026-04-20"
}
```

### 5. 提交并推送

```bash
cd rizhilu
git add data/2026-04-20.json dates.json
git commit -m "新增：2026-04-20 日知录"
git push origin main
```

## 文件结构

```
rizhilu/
├── index.html          # 前端页面（按需加载）
├── dates.json          # 日期索引（轻量，几百字节）
├── data/
│   ├── 2026-04-20.json  # 当日数据
│   ├── 2026-04-19.json
│   └── ...
└── data.json           # （已废弃，不再使用）
```

## 前端加载机制

1. 首次加载：读取 `dates.json` 获取日期列表
2. 按需加载：每次加载 5 天的数据（`data/YYYY-MM-DD.json`）
3. 加载更多：点击按钮继续加载后面的日期

## 附：市场数据获取

推送前可获取实时市场数据：
```bash
node get_market_data.js
```

**OpenNews API 新闻获取（每天限制80次，仅用于时事热点）**
```bash
node get_news.js          # 测试，输出到控制台
```

**功能：**
- 获取带 AI 评分的新闻（score/grade/signal）
- 支持 Reuters、Bloomberg 等权威来源
- 信号：long/short/neutral
- 摘要：中文/英文双语

## 定时任务

每天早上 7:00 (Asia/Shanghai) 自动执行推送。

## ⚠️ 注意事项

1. 每篇文章的 `id` 格式：`YYYY-MM-DD_NN`（如 `2026-04-20_01`）
2. 时事热点必须有 `references`（至少 2 条）
3. 经典智慧和历史事件不需要 `references`
4. 双方立场必须呈现，区分声明与事实
5. 具体数字必须有来源依据
6. **时事热点新闻日期必须校验**：只选2-3天内的，优先选当天或昨天的，绝不能选超过3天前的旧闻
7. **新闻来源优先顺序**：Al Jazeera（可全文获取）、AP News、新华社、财新、澎湃；Reuters需JS暂不支持
8. **文章结构标准格式**：每篇必须包含 `### 核心认知`、`### 直接行动`、`### 核心要点` 三个小节，结尾必须有 `> 金句` 引用
