/**
 * 日知录 - 数据合并脚本
 * 将 data/ 目录下所有日期文件合并为 data.json
 * 
 * 使用方式: node merge_data.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = 'C:\\Users\\Administrator\\.openclaw\\workspace\\selfimprove\\rizhilu';
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
  const content = fs.readFileSync(filePath, 'utf8');
  const articles = JSON.parse(content);
  articles.forEach(a => {
    // Check for duplicate ID
    if (!allArticles.find(x => x.id === a.id)) {
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

console.log(`✅ 合并完成: ${dateFiles.length} 个日期文件, 共 ${allArticles.length} 篇文章`);
console.log(`📁 输出: ${OUTPUT_FILE}`);
