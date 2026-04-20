# 日知录 · 每日推送工作流

> 更新时间：2026-04-20
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
  "id": "YYYY-MM-DD_NN",
  "title": "标题",
  "body": "正文（Markdown）",
  "source": "日知录",
  "tags": ["标签1", "标签2"],
  "date": "YYYY-MM-DD"
}
```

**ID 命名规范**：`YYYY-MM-DD_NN`（如 `2026-04-20_01`）
- 按日期分组，同一天内按序号排列（01, 02, 03...）

**references 格式规范**：
- **时事热点**：必须有 references，格式为 `[{title: "标题", url: "https://..."}]`
- **经典智慧**：无 references 字段
- **历史事件**：无 references 字段

**body 结构**：
1. 开头hook（1-2句，抓住注意力）
2. `### 核心认知`（给出洞察，不泛泛而谈）
3. `### 直接行动`（1-4条具体可执行）
4. `### 核心要点`（3-5条，**注意：标题用 `###`，不是加粗**）
5. `> 金句`（收尾）
6. `---` 分隔线（在末尾）

### 4. 推送前审查

- [ ] 内容通顺，无错别字、无乱码
- [ ] 格式正确（标题、正文、来源、标签、日期）
- [ ] 有「核心认知」
- [ ] 有「直接行动」
- [ ] 有「核心要点」总结（3-5条）+ 收尾金句
- [ ] **事实准确**：新闻类必须先搜索核实，不能凭记忆写
- [ ] **时事热点必须有至少2个参考来源**
- [ ] **具体数字/结论必须有来源**：文章中提到具体目标价、数据、预测时，必须说明参考依据
- [ ] **经典智慧纯阐述**：只做经典本身的解读，不强行关联当下事件

### 5. 写入数据

手动创建 `rizhilu/data/YYYY-MM-DD.json` 文件。

### 6. 自动合并与推送

**GitHub Actions 自动处理（无需手动操作）：**
- 推送 `data/*.json` 文件后，GitHub Actions 自动运行 `merge_data.js`
- 自动将新内容合并到 `data.json`
- 自动提交并推送到 main 分支

**网站自动更新：** 合并完成后，GitHub Pages 会自动重新构建（约1-3分钟）。

### 7. 更新状态

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
| GitHub Actions | `.github/workflows/merge-data.yml` |
| 推送状态 | `memory/cognitive-push-state.json` |
| 已分析热点 | `memory/analyzed-topics.json` |
| 每日记录 | `memory/YYYY-MM-DD.md` |

---

## ⚠️ 重要规则

1. **禁止直接编辑** `rizhilu/data.json`（由 merge_data.js 自动生成）
2. **写入规则**：
   - 创建 `rizhilu/data/YYYY-MM-DD.json` 文件
   - ID 格式：`YYYY-MM-DD_NN`（如 `2026-04-20_01`）
   - 推送到 GitHub 后，GitHub Actions 自动合并到 data.json
3. **references 格式**：
   - 时事热点：必须包含至少2个 references，格式为 `[{title, url}]` 对象数组
   - 经典智慧：无 references
   - 历史事件：无 references
4. **新闻类内容必须先搜索核实**，不能凭记忆写
5. **语言简洁有力**，不要 ChatGPT 流水账
6. **历史事件优先选中国**的（见 MEMORY.md）
7. **注意 JSON 格式**：body 字段中的双引号必须转义，否则 merge_data.js 会跳过该文件

---

## 常见问题

### Q: 网站上看不到新推送的内容？
A: 检查是否已将新日期文件推送到 GitHub。GitHub Actions 会自动合并 data.json 并更新网站（约1-3分钟）。

### Q: merge_data.js 跳过某个日期文件？
A: 可能原因：
1. JSON 格式错误（body 字段双引号未转义）
2. 时事热点缺少参考来源（需要至少2个）

---

## 参考示例

完整示例见文章 #37「知彼知己，百战不殆」
