/**
 * 日知录 - 数据合并脚本
 * 将 data/ 目录下所有日期文件合并为 data.json
 * 
 * 使用方式: node merge_data.js
 */

const fs = require('fs');
const path = require('path');

// 自动获取当前脚本所在目录（支持 Windows 和 Linux）
const WORKSPACE = __dirname;
const DATA_DIR = path.join(WORKSPACE, 'data');
const OUTPUT_FILE = path.join(WORKSPACE, 'data.json');

// Read all date files
const dateFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')).sort();

if (dateFiles.length === 0) {
  console.log('没有找到日期文件');
  process.exit(0);
}

const allArticles = [];

// Merge all date files (newest dates first for display order)
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
  articles.forEach(a => {
    // Check for duplicate ID
    if (!allArticles.find(x => x.id === a.id)) {
      // Validate: 时事热点必须有参考来源
      const isCurrentAffairs = a.category === '时事热点' || (a.tags && a.tags.includes('时事热点'));
      if (isCurrentAffairs) {
        if (!a.references || !Array.isArray(a.references) || a.references.length < 2) {
          console.error(`✗ 文章 "${a.title}" 是时事热点但缺少足够的参考来源`);
          console.error(`  需要至少2个references，当前: ${a.references ? a.references.length : 0}个`);
          process.exit(1);
        }
      }
      allArticles.push(a);
    } else {
      console.log(`⚠️ 跳过重复ID: #${a.id} ${a.title}`);
    }
  });
});

// Sort by ID descending (newest first)
allArticles.sort((a, b) => b.id - a.id);

// Write merged data
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allArticles, null, 2), 'utf8');

// Auto-generate dates.json from directory (no manual maintenance needed)
const dates = dateFiles
  .map(f => f.replace('.json', ''))
  .sort((a, b) => b.localeCompare(a)); // descending (newest first)

const datesFile = path.join(WORKSPACE, 'dates.json');
const datesData = {
  dates: dates,
  lastUpdated: new Date().toISOString().slice(0, 10)
};
fs.writeFileSync(datesFile, JSON.stringify(datesData, null, 2), 'utf8');

console.log(`✅ 合并完成: ${dateFiles.length} 个日期文件, 共 ${allArticles.length} 篇文章`);
console.log(`📁 输出: ${OUTPUT_FILE}`);
console.log(`📅 日期索引: ${datesFile} (${dates.length} 个日期)`);
