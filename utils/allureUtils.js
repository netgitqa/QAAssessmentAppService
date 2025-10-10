function clientInfo(value) {
  const chromeClient = value.match(/Chrome\/([\d.]+)/);
  const safariClient = value.match(/Version\/([\d.]+) Safari/);

  if (chromeClient && !value.includes('Edge')) {
    return `${chromeClient[1]}`;
  }

  if (safariClient && !value.includes('Chrome')) {
    return `${safariClient[1]}`;
  }
  
  return 'Unknown';
}

async function viewportInfo(page) {
  const userAgent = await page.evaluate(() => navigator.userAgent);
  const webClient = clientInfo(userAgent);

  return `${webClient}`;
}

module.exports = {
    viewportInfo
};