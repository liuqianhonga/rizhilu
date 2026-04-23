/**
 * 日知录 - 数据合并脚本
 * 将 data/ 目录下所有日期文件合并为 data.json
 * 同时生成 dates.json（含文章标题索引，方便前端一次请求渲染目录）
 * 
 * 使用方式: node merge_data.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = __dirname;
const DATA_DIR = path.join(WORKSPACE, 'data');
const OUTPUT_FILE = path.join(WORKSPACE, 'data.json');
const DATES_FILE = path.join(WORKSPACE, 'dates.json');

const dateFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')).sort();

if (dateFiles.length === 0) {
  console.log('没有找到日期文件');
  process.exit(0);
}

const allArticles = [];
const datesIndex = [];  // [{date, count, articles: [{id, title, category}]}]

dateFiles.forEach(file => {
  const filePath = path.join(DATA_DIR, file);
  let articles;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    articles = JSON.parse(content);
  } catch (e) {
    console.warn(`⚠️ 跳过无效文件 ${file}: ${e.message.substring(0, 80)}`);
    return;
  }

  const date = file.replace('.json', '');
  const dayArticles = [];

  articles.forEach(a => {
    if (!allArticles.find(x => x.id === a.id)) {
      const isCurrentAffairs = a.category === '时事热点' || (a.tags && a.tags.includes('时事热点'));
      if (isCurrentAffairs) {
        if (!a.references || !Array.isArray(a.references) || a.references.length < 2) {
          console.error(`✗ 文章 "${a.title}" 是时事热点但缺少足够的参考来源`);
          console.error(`  需要至少2个references，当前: ${a.references ? a.references.length : 0}个`);
          process.exit(1);
        }
      }
      allArticles.push(a);
      dayArticles.push({
        id: a.id,
        title: a.title,
        category: a.category
      });
    } else {
      console.log(`⚠️ 跳过重复ID: #${a.id} ${a.title}`);
    }
  });

  datesIndex.push({
    date: date,
    count: dayArticles.length,
    articles: dayArticles
  });
});

// Sort articles by ID descending (newest first)
allArticles.sort((a, b) => b.id.localeCompare(a.id));

// Write merged data
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allArticles, null, 2), 'utf8');

// Write dates.json with article index
const datesData = {
  totalArticles: allArticles.length,
  dates: datesIndex,
  lastUpdated: new Date().toISOString().slice(0, 10)
};
fs.writeFileSync(DATES_FILE, JSON.stringify(datesData, null, 2), 'utf8');

console.log(`✅ 合并完成: ${dateFiles.length} 个日期文件, 共 ${allArticles.length} 篇文章`);
console.log(`📁 输出: ${OUTPUT_FILE}`);
console.log(`📅 日期索引: ${DATES_FILE} (${datesIndex.length} 个日期, 含文章标题)`);
