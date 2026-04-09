const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data.json');
let content = fs.readFileSync(file, 'utf8');

// 先替换中文引号为普通引号
content = content.replace(/\u201c/g, '"').replace(/\u201d/g, '"');

// 解析并重新序列化，让 JSON.stringify 自动处理转义
try {
  const data = JSON.parse(content);
  content = JSON.stringify(data, null, 2);
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ JSON fixed and valid');
} catch(e) {
  // 如果无法解析，手动修复：在 body 字段内的双引号前加反斜杠
  console.log('Manual fix needed, trying regex...');
  
  // 这个正则很复杂，改用简单方法：直接替换已知的问题文本
  content = content.replace('"冤大头"', '\\"冤大头\\"');
  content = content.replace('"给钱"', '\\"给钱\\"');
  content = content.replace('"冷战"', '\\"冷战\\"');
  content = content.replace('"投资"', '\\"投资\\"');
  
  fs.writeFileSync(file, content, 'utf8');
  
  try {
    JSON.parse(content);
    console.log('✓ Manual fix successful');
  } catch(e2) {
    console.log('✗ Still invalid:', e2.message);
  }
}
