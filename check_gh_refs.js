const https = require('https');
https.get('https://raw.githubusercontent.com/liuqianhonga/rizhilu/main/data.json', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const articles = JSON.parse(data);
    articles.filter(a => a.references && a.references.length > 0).slice(0, 3).forEach(a => {
      console.log(a.id, '\n', JSON.stringify(a.references, null, 2), '\n');
    });
  });
}).on('error', console.error);
