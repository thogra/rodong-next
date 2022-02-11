
import fetch from 'node-fetch';

const baseUrl = 'http://www.rodong.rep.kp/';
const cacheUrlPrefix = "http://webcache.googleusercontent.com/search?q=cache:";

export async function fetchPage(path, { useCache }) {
  const url=  `${baseUrl}${path}`;
  const response = await fetch(`${useCache ? cacheUrlPrefix: ''}${url}`);
  const body = await response.text();
  return body;
}

export async function fetchArticlePage({ newsId, pageId }, options) {
  const articleUrl = `en/index.php?strPageID=${pageId}&newsID=${newsId}`;
  const article =  await fetchPage(articleUrl, options);
  return article;
}
