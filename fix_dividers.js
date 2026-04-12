/**
 * 修复文章中核心要点分割线位置
 * 问题：--- 放在核心要点标题之前
 * 修复：把 --- 移到核心要点内容之后（金句之后）
 */

const fs = require('fs');
const path = require('path');

function fixDividers() {
  const dataDir = path.join(__dirname, 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.json$/));
  
  let fixedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    let articles = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(articles)) articles = [articles];
    
    let modified = false;
    
    articles = articles.map(article => {
      if (!article.body || !article.body.includes('**核心要点')) {
        return article;
      }
      
      const body = article.body;
      const coreHeader = '**核心要点';
      const coreIdx = body.indexOf(coreHeader);
      if (coreIdx === -1) return article;
      
      // 找到核心要点之前的 ---
      const beforeCore = body.slice(0, coreIdx);
      const hrPattern = '\n---\n';
      const hrIdx = beforeCore.lastIndexOf(hrPattern);
      
      if (hrIdx === -1) return article;
      
      // 找到核心要点区块的结尾（金句通常是 > 开头，以 。或 。」 结尾的块引用）
      const afterCore = body.slice(coreIdx);
      
      // 金句格式：> 开头，内容以 。 或 。」 结尾
      const lastQuoteMatch = afterCore.match(/^>.*[。」]+.*$/gm);
      
      if (!lastQuoteMatch) return article;
      
      const lastQuote = lastQuoteMatch[lastQuoteMatch.length - 1];
      const lastQuoteIdx = afterCore.lastIndexOf(lastQuote);
      const coreSectionEnd = lastQuoteIdx + lastQuote.length;
      
      // 重构内容
      const part1 = body.slice(0, hrIdx); // --- 之前的内容
      const part2 = afterCore.slice(0, coreSectionEnd); // 核心要点整个区块
      const part3 = body.slice(hrIdx + hrPattern.length, coreIdx); // ---和核心要点之间
      const part4 = afterCore.slice(coreSectionEnd); // 金句之后
      
      // 如果 part3 不为空，说明结构不对，跳过
      if (part3.trim()) {
        console.log(`警告: ${article.id} 的结构异常，跳过`);
        return article;
      }
      
      const newBody = part1 + part2 + '\n\n---\n' + part4;
      
      article.body = newBody;
      modified = true;
      return article;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), 'utf8');
      fixedCount++;
      console.log(`修复: ${file}`);
    }
  });
  
  console.log(`\n共修复 ${fixedCount} 个文件`);
}

fixDividers();
