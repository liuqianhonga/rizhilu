/**
 * 重新生成所有文章的ID和排序
 * ID格式：YYYYMMDD-NN（日期-当天序号）
 * 排序：日期正序，分类内经典解读→时事热点→历史事件
 */

const fs = require('fs');
const path = require('path');

const CATEGORY_PRIORITY = {
  // 经典类
  '经典智慧': 1, '经典解读': 1, '经典': 1,
  '道德经': 1, '孙子兵法': 1, '易经': 1, '黄帝内经': 1,
  '资治通鉴': 1, '论语': 1, '王阳明': 1, '天道': 1,
  '哲学': 1, '处世智慧': 1, '商业智慧': 1, '战略思维': 1,
  '决策智慧': 1, '历史典故': 1, '逆向思维': 1, '反思': 1,
  // 时事类
  '时事热点': 2, '宏观经济': 2, '政策分析': 2, '美联储': 2,
  '中美关税': 2, '关税': 2, '地缘政治': 2, '外交': 2,
  '美国政治': 2, '中美关系': 2, '美伊冲突': 2, '战争': 2,
  '巴基斯坦': 2, 'TikTok': 2, 'AI芯片': 2, '科技竞争': 2,
  '科技': 2, '航天': 2, 'A股': 2, '金银': 2,
  // 历史类
  '历史事件': 3, '历史': 3, '金融危机': 3, '博弈论': 3, '集体行动': 3
};

function getPrimaryCategory(tags) {
  if (!tags || !Array.isArray(tags)) return 999;
  for (const tag of tags) {
    if (CATEGORY_PRIORITY[tag] !== undefined) {
      return CATEGORY_PRIORITY[tag];
    }
  }
  return 999;
}

function reassignIds() {
  const dataDir = path.join(__dirname, 'data');
  
  // 读取所有日期文件
  const files = fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.json') && f.match(/^\d{4}-\d{2}-\d{2}\.json$/))
    .sort();
  
  let allArticles = [];
  
  // 读取所有文章
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const dateArticles = Array.isArray(articles) ? articles : [articles];
    allArticles = allArticles.concat(dateArticles);
  });
  
  console.log(`读取了 ${allArticles.length} 篇文章`);
  
  // 按日期正序、分类优先级排序
  allArticles.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    const pA = getPrimaryCategory(a.tags);
    const pB = getPrimaryCategory(b.tags);
    if (pA !== pB) return pA - pB;
    return (a.id || 0) - (b.id || 0);
  });
  
  // 按日期分组
  const byDate = {};
  allArticles.forEach(article => {
    if (!byDate[article.date]) byDate[article.date] = [];
    byDate[article.date].push(article);
  });
  
  // 每个日期内重新编号（全局顺序）
  Object.keys(byDate).sort().forEach(date => {
    let seq = 0;
    byDate[date].forEach(article => {
      seq++;
      article.id = date.replace(/-/g, '') + '-' + String(seq).padStart(2, '0');
      
      // 设置标准分类名称
      const p = getPrimaryCategory(article.tags);
      if (p === 999) article.category = '历史事件';
      else if (p === 1) article.category = '经典智慧';
      else if (p === 2) article.category = '时事热点';
      else article.category = '历史事件';
      
      // 删除临时字段
      delete article._seq;
    });
  });
  
  // 写回各日期文件
  Object.keys(byDate).sort().forEach(date => {
    const filePath = path.join(dataDir, date + '.json');
    fs.writeFileSync(filePath, JSON.stringify(byDate[date], null, 2), 'utf8');
    console.log(`写入 ${path.basename(filePath)}: ${byDate[date].length} 篇`);
  });
  
  // 合并到 data.json
  const merged = [];
  Object.keys(byDate).sort().forEach(date => {
    merged.push(...byDate[date]);
  });
  
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(merged, null, 2), 'utf8');
  console.log(`\n合并完成: ${merged.length} 篇文章`);
  console.log('前10个ID:', merged.slice(0, 10).map(a => a.id));
}

reassignIds();
