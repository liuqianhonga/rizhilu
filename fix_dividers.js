/**
 * 修复核心要点分割线位置
 * 目标：--- 在核心要点内容之后、金句之前
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
      
      // 查找 --- 的位置
      const hrIdx = body.lastIndexOf('\n\n---\n');
      if (hrIdx === -1) return article;
      
      // 查找金句
      const quotePattern = /^>.*[。」]+.*$/gm;
      const quoteMatch = body.match(quotePattern);
      if (!quoteMatch) return article;
      
      const lastQuote = quoteMatch[quoteMatch.length - 1];
      const lastQuoteFullIdx = body.lastIndexOf(lastQuote);
      const lastQuoteEndIdx = lastQuoteFullIdx + lastQuote.length;
      
      // 如果 --- 在金句之后，需要调整
      if (hrIdx > lastQuoteEndIdx) {
        // 删除末尾的 ---，在金句之后插入 ---
        const beforeHr = body.slice(0, hrIdx);
        const afterHr = body.slice(hrIdx + 5); // 去掉 \n\n---\n
        
        // 在金句之后插入 ---
        const newBody = beforeHr.slice(0, lastQuoteEndIdx) + '\n\n---\n' + beforeHr.slice(lastQuoteEndIdx) + afterHr;
        
        article.body = newBody;
        modified = true;
      }
      
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
