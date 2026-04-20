#!/usr/bin/env node
/**
 * 从 OpenNews API 获取新闻
 * 使用环境变量 OPENNEWS_TOKEN
 */
const { execSync } = require('child_process');

// OpenNews API 配置
const API_URL = 'https://ai.6551.io/open/news_search';

function searchNews(params = {}) {
  const {
    limit = 10,
    page = 1,
    q = '',
    coins = [],
    engineTypes = {},
    hasCoin = false
  } = params;
  
  const body = { limit, page };
  if (q) body.q = q;
  if (coins.length > 0) body.coins = coins;
  if (Object.keys(engineTypes).length > 0) body.engineTypes = engineTypes;
  if (hasCoin) body.hasCoin = hasCoin;
  
  const bodyJson = JSON.stringify(body);
  // Windows 环境变量语法：%VAR%
  const cmd = `curl -s -X POST "${API_URL}" -H "Authorization: Bearer %OPENNEWS_TOKEN%" -H "Content-Type: application/json" -d "${bodyJson.replace(/"/g, '\\"')}"`;
  
  try {
    const output = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    return JSON.parse(output);
  } catch (e) {
    console.error('API调用失败:', e.message);
    return null;
  }
}

/**
 * 获取最新新闻（过滤高质量来源）
 */
function getLatestNews(limit = 10) {
  const result = searchNews({ limit, page: 1 });
  if (!result || !result.success) return [];
  
  return result.data.filter(item => 
    item.aiRating && item.aiRating.status === 'done'
  );
}

/**
 * 搜索特定关键词的高质量新闻
 */
function searchByKeyword(keyword, limit = 10) {
  const result = searchNews({ q: keyword, limit, page: 1 });
  if (!result || !result.success) return [];
  
  return result.data.filter(item => 
    item.aiRating && item.aiRating.status === 'done'
  );
}

/**
 * 获取权威来源的新闻（Reuters, Bloomberg, AP 等）
 * 放宽条件：只要来源匹配就返回，AI评分可选
 */
function getAuthoritativeNews(limit = 10) {
  const result = searchNews({ limit: limit * 3, page: 1 });
  if (!result || !result.success) return [];
  
  const goodSources = ['Reuters', 'Bloomberg', 'AP', 'News Websites', 'Wall Street', 'Financial'];
  return result.data.filter(item => {
    const isGoodSource = item.newsType && goodSources.some(s => item.newsType.includes(s));
    return isGoodSource;
  }).slice(0, limit);
}

// 测试
if (require.main === module) {
  console.log('=== 测试 OpenNews API ===\n');
  
  // 获取最新新闻
  console.log('1. 获取最新新闻（限制3条）...');
  const latest = searchNews({ limit: 3, page: 1 });
  if (latest && latest.success) {
    console.log(`总新闻数: ${latest.total}`);
    latest.data.forEach((item, i) => {
      console.log(`\n--- 新闻 ${i+1} ---`);
      console.log(`来源: ${item.newsType}`);
      console.log(`内容: ${item.text.substring(0, 100)}...`);
      if (item.aiRating && item.aiRating.status === 'done') {
        console.log(`AI评分: ${item.aiRating.score} (${item.aiRating.grade})`);
        console.log(`信号: ${item.aiRating.signal}`);
        console.log(`摘要: ${item.aiRating.summary}`);
      } else {
        console.log(`AI评分: pending`);
      }
    });
  }
  
  console.log('\n\n2. 搜索 Iran/Israel 相关新闻（3条）...');
  const warNews = searchByKeyword('Iran Israel', 3);
  if (warNews.length > 0) {
    warNews.forEach((item, i) => {
      console.log(`\n--- ${i+1} [${item.newsType}] ---`);
      console.log(`AI评分: ${item.aiRating.score} (${item.aiRating.grade})`);
      console.log(`信号: ${item.aiRating.signal}`);
      console.log(`摘要: ${item.aiRating.summary}`);
    });
  } else {
    console.log('无结果');
  }
  
  console.log('\n\n3. 获取权威来源新闻（Reuters/Bloomberg/AP）...');
  const authNews = getAuthoritativeNews(3);
  if (authNews.length > 0) {
    authNews.forEach((item, i) => {
      console.log(`\n--- ${i+1} [${item.newsType}] ---`);
      console.log(`内容: ${item.text.substring(0, 80)}...`);
      console.log(`AI评分: ${item.aiRating.score} (${item.aiRating.grade})`);
    });
  } else {
    console.log('无结果（可能权威媒体新闻还未被AI评分）');
  }
}

module.exports = { searchNews, getLatestNews, searchByKeyword, getAuthoritativeNews };
