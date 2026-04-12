# 日知录 · 每日推送工作流

> 更新时间：2026-04-12
> 内容领域详见 MEMORY.md

---

## 触发条件
- 每天早上 7:00（Cron 任务触发）
- 或心跳检查时发现 `lastPushDate != 今天`

---

## 每日内容（4 篇）

1. **时事热点** × 2
2. **经典智慧** × 1
3. **历史事件** × 1

（内容领域详情见 MEMORY.md）

---

## 执行步骤

### 1. 搜索热点

用 Node.js 通过 SearXNG 搜索真实新闻：
- 国际：`http://192.168.9.55:5080/search?q=today world news&format=json&language=en`
- 国内：`http://192.168.9.55:5080/search?q=今日热点新闻&format=json&language=zh-CN`

读取 `memory/analyzed-topics.json` 过滤已分析事件。

### 2. 多源交叉核实
- 不要只搜一个关键词就写
- 同一事件至少搜2-3个不同来源，验证事实是否一致
- 如果搜索结果互相矛盾（如「通胀下行」vs「战争油价上涨」），说明背景已变，需要额外搜索确认当下真实情况
- **逻辑不自洽时，不要写**，等核实清楚再说

### 3. 生成内容

每篇文章格式：
```json
{
  "title": "标题",
  "body": "正文（Markdown）",
  "source": "日知录",
  "tags": ["标签1", "标签2"],
  "date": "YYYY-MM-DD"
}
```

**body 结构**：
1. 开头hook（1-2句，抓住注意力）
2. `### 核心认知`（给出洞察，不泛泛而谈）
3. `### 直接行动`（1-4条具体可执行）
4. `---` 分隔线
5. `**核心要点：**`（3-5条）
6. `> 金句`（收尾）

### 3. 推送前审查

- [ ] 内容通顺，无错别字、无乱码
- [ ] 格式正确（标题、正文、来源、标签、日期）
- [ ] 有「核心认知」
- [ ] 有「直接行动」
- [ ] 有「核心要点」总结（3-5条）+ 收尾金句
- [ ] **事实准确**：新闻类必须先搜索核实，不能凭记忆写

### 4. 写入数据

```bash
# 批量推送（推荐）
node daily_push.js batch @file.json
```

- 自动写入 `rizhilu/data/YYYY-MM-DD.json`
- 自动合并到 `data.json`
- 自动推送到 GitHub

### 5. 更新状态

- 更新 `memory/cognitive-push-state.json` 的 `lastPushDate`
- 记录到 `memory/YYYY-MM-DD.md`
- 更新 `memory/analyzed-topics.json`

---

## 文件路径

| 类型 | 路径 |
|------|------|
| 数据目录 | `rizhilu/data/` |
| 合并后数据 | `rizhilu/data.json` |
| 合并脚本 | `rizhilu/merge_data.js` |
| 推送脚本 | `workspace/selfimprove/daily_push.js` |
| 推送状态 | `memory/cognitive-push-state.json` |
| 已分析热点 | `memory/analyzed-topics.json` |
| 每日记录 | `memory/YYYY-MM-DD.md` |

---

## ⚠️ 重要规则

1. **禁止直接编辑** `rizhilu/data.json` 和 `rizhilu/data/*.json`
2. 所有写操作必须通过 `daily_push.js` 完成
3. **新闻类内容必须先搜索核实**，不能凭记忆写
4. **语言简洁有力**，不要 ChatGPT 流水账
5. **历史事件优先选中国**的（见 MEMORY.md）

---

## 参考示例

完整示例见文章 #37「知彼知己，百战不殆」
