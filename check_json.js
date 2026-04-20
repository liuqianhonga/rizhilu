const https = require('https');
https.get('https://raw.githubusercontent.com/liuqianhonga/rizhilu/main/data.json', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const articles = JSON.parse(data);
      console.log('GitHub data.json OK, articles:', articles.length);
    } catch (e) {
      console.log('JSON parse error:', e.message);
      console.log('First 200 chars:', data.substring(0, 200));
    }
  });
}).on('error', console.error);
