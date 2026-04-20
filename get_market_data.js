#!/usr/bin/env node
/**
 * 获取市场数据 - Node.js 包装器
 * 调用 Python 脚本获取 yfinance 数据
 */
const { execSync } = require('child_process');
const path = require('path');

// Python 路径（使用招财喵的 venv）
const PYTHON_PATH = 'C:\\Users\\Administrator\\Desktop\\zhaocai-miao\\.venv\\Scripts\\python.exe';
const SCRIPT_PATH = path.join(__dirname, 'get_market_data.py');

function getMarketData() {
  try {
    const output = execSync(`"${PYTHON_PATH}" "${SCRIPT_PATH}"`, {
      encoding: 'utf8',
      timeout: 60000
    });
    return JSON.parse(output);
  } catch (e) {
    console.error('获取市场数据失败:', e.message);
    return null;
  }
}

// 命令行调用
if (require.main === module) {
  const data = getMarketData();
  if (data) {
    console.log('市场数据获取成功:');
    console.log('BTC:', data.crypto.BTC);
    console.log('ETH:', data.crypto.ETH);
    console.log('黄金 (GLD):', data.gold.GLD, data.gold.unit);
    console.log('原油 (USO):', data.oil.USO, data.oil.unit);
    console.log('标普500:', data.indices['^GSPC'].price);
    console.log('纳斯达克:', data.indices['^IXIC'].price);
  }
}

module.exports = { getMarketData };
