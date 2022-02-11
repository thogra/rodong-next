
import fetch from 'node-fetch';

const baseUrl = 'http://www.rodong.rep.kp/';

export async function fetchFrontPage() {
  const response = await fetch(`${baseUrl}en/`);
  const body = await response.text();
  return body;
}

export async function fetchPage(path) {
  const url=  `${baseUrl}${path}`;
  console.log('fetching page', url);
  const response = await fetch(url);
  const body = await response.text();
  console.log('fetched page', path);
  return body;
}

export async function fetchArticlePage({ newsId, pageId }) {
  const articleUrl = `en/index.php?strPageID=${pageId}&newsID=${newsId}`;
  const article =  await fetchPage(articleUrl);
  console.log('fetched article!');
  return article;
}
