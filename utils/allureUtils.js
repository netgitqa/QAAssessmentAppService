function clientInfo(value) {
  const chromeClient = value.match(/Chrome\/([\d.]+)/);
  const safariClient = value.match(/Version\/([\d.]+) Mobile.*Safari/);

  if (chromeClient) {
    return 'Chrome';
  } else if (safariClient) {
    return 'Safari';
  }
  return 'Unknown';
}

async function viewportInfo(value) {
  const screenInfo = await value.execute(() => {
    return {
      userAgent: navigator.userAgent
    };
  });

  const webClient = clientInfo(screenInfo.userAgent);

  return `${webClient}`;
}

module.exports = {
    userAgentInfo,
    viewportInfo
};