const generateCommonHeader = (url: string, referer: string) => {
  const parsedUrl = new URL(url)
  const origin = `${parsedUrl.protocol}//${parsedUrl.host}`

  return {
    Connection: 'keep-alive',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: '*/*',
    Origin: origin,
    Referer: referer,
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
  }
}

export default generateCommonHeader
