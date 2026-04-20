const fs = require('fs');

// Read the corrupted file
const content = fs.readFileSync('data/2026-04-17.json', 'utf8');

// The problem is body fields contain unescaped double quotes
// We need to manually fix this by rebuilding the file

// For each article, we need to escape the body content properly
// Let's try a different approach: replace the problematic strings

let fixed = content;

// Fix specific known issues - body field contains " which breaks JSON
// Replace the body field values with properly escaped versions

// Since we know the structure, let's try a simpler fix:
// Replace any unescaped " that appears after Chinese/punctuation with a Chinese quote
fixed = fixed.replace(/([\u4e00-\u9fa5]),"([\u4e00-\u9fa5])/g, '$1，\"$2');
fixed = fixed.replace(/([\u4e00-\u9fa5])"([\u4e00-\u9fa5])/g, '$1\"$2');

// Actually this is getting complex. Let's try a different approach:
// Just escape all double quotes inside the body string values

try {
  JSON.parse(fixed);
  console.log('Fixed successfully!');
  fs.writeFileSync('data/2026-04-17.json', fixed, 'utf8');
} catch(e) {
  console.log('Still invalid:', e.message);
  
  // Let's try even more aggressive fix
  // Replace ALL double quotes in body field values with escaped quotes
  const lines = content.split('\n');
  let inBody = false;
  let bodyStart = -1;
  let result = [];
  
  for(let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if(line.includes('"body":')) {
      inBody = true;
      result.push(line);
    } else if(inBody) {
      // Check if we've left the body field (next field starts)
      if(line.match(/^\s*"[a-z]+":/)) {
        inBody = false;
        result.push(line);
      } else if(line.includes('"') && !line.trim().startsWith('[') && !line.trim().startsWith(']')) {
        // Line has quotes but is part of body - need to escape internal quotes
        let fixedLine = line;
        // Find quoted strings and escape internal quotes
        const quotePattern = /"([^"]*)"/g;
        let match;
        let newLine = '';
        let lastEnd = 0;
        
        while((match = quotePattern.exec(line)) !== null) {
          newLine += line.substring(lastEnd, match.index);
          // Check if this quote needs escaping
          if(match[1].includes('"') || (match.index > 0 && line[match.index-1] !== '\\')) {
            newLine += '"' + match[1].replace(/"/g, '\\"') + '"';
          } else {
            newLine += match[0];
          }
          lastEnd = match.index + match[0].length;
        }
        newLine += line.substring(lastEnd);
        result.push(newLine);
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }
  
  const newContent = result.join('\n');
  try {
    JSON.parse(newContent);
    console.log('Fixed with line-by-line approach!');
    fs.writeFileSync('data/2026-04-17.json', newContent, 'utf8');
  } catch(e2) {
    console.log('Still invalid:', e2.message);
  }
}
