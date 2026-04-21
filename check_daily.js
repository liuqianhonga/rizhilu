#!/usr/bin/env node
/**
 * 日知录每日内容检查脚本
 * 用法: node check_daily.js
 * 或: node check_daily.js 2026-04-21
 */

const path = require('path');
const fs = require('fs');

const date = process.argv[2] || new Date().toISOString().slice(0, 10);
const filePath = path.join(__dirname, 'data', `${date}.json`);

console.log(`\n========== 日知录内容检查: ${date} ==========\n`);

let hasError = false;

// 1. 检查文件是否存在
if (!fs.existsSync(filePath)) {
  console.error('❌ 文件不存在:', filePath);
  process.exit(1);
}

// 2. 检查 JSON 语法
let data;
try {
  const content = fs.readFileSync(filePath, 'utf8');
  data = JSON.parse(content);
  console.log('✅ JSON 语法正确');
} catch(e) {
  console.error('❌ JSON 语法错误:', e.message);
  hasError = true;
}

// 3. 检查文章数量
if (data) {
  if (data.length !== 4) {
    console.error(`❌ 文章数量错误: 期望4篇，实际${data.length}篇`);
    hasError = true;
  } else {
    console.log(`✅ 文章数量: ${data.length}篇`);
  }

  // 4. 检查每篇文章结构
  const requiredSections = ['核心认知', '直接行动', '核心要点'];
  data.forEach((article, i) => {
    console.log(`\n--- 文章${i+1}: ${article.title.substring(0, 30)}...`);

    // 检查分类
    if (!article.category) {
      console.error('❌ 缺少 category');
      hasError = true;
    } else {
      console.log(`✅ category: ${article.category}`);
    }

    // 检查 references（时事热点必须有）
    if (article.category === '时事热点') {
      if (!article.references || article.references.length < 2) {
        console.error('❌ 时事热点必须有至少2条 references');
        hasError = true;
      } else {
        console.log(`✅ references: ${article.references.length}条`);
      }
    }

    // 检查 body
    if (!article.body) {
      console.error('❌ 缺少 body');
      hasError = true;
      return;
    }

    // 检查三个小节
    const missingSections = requiredSections.filter(s => !article.body.includes(`### ${s}`));
    if (missingSections.length > 0) {
      console.error(`❌ 缺少小节: ${missingSections.join(', ')}`);
      hasError = true;
    } else {
      console.log(`✅ 三个小节: 核心认知 + 直接行动 + 核心要点`);
    }

    // 检查结尾金句
    if (!article.body.includes('> ')) {
      console.error('❌ 缺少结尾金句 (> 引用)');
      hasError = true;
    } else {
      console.log('✅ 结尾金句: 存在');
    }

    // 检查新闻日期（时事热点必须检查）
    if (article.category === '时事热点') {
      const refs = article.references || [];
      const today = new Date();
      const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
      const refUrls = refs.map(r => r.url);

      // 检查是否有过于老旧的新闻（通过URL中的日期）
      const hasOldNews = refUrls.some(url => {
        const match = url.match(/2026\/(\d{2})\/(\d{2})/);
        if (!match) return false;
        const month = parseInt(match[1]);
        const day = parseInt(match[2]);
        const newsDate = new Date(2026, month - 1, day);
        return newsDate < twoDaysAgo;
      });

      if (hasOldNews) {
        console.warn('⚠️ 时事热点含有2天以前的旧闻，请确认新闻日期');
      } else {
        console.log('✅ 新闻日期: 正常');
      }
    }
  });
}

// 5. 总结
console.log('\n========== 检查结果 ==========');
if (hasError) {
  console.error('❌ 检查未通过，存在上述错误');
  process.exit(1);
} else {
  console.log('✅ 所有检查通过，可以推送');
  process.exit(0);
}
