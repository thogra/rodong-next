
import fetch from 'node-fetch';
import fs from 'fs';
import _ from 'lodash';
import normalizeNewline from 'normalize-newline';

export const baseUrl = 'http://www.rodong.rep.kp';

const readStale = process.env.READ_FROM_FILE === 'true';
const saveToFile = !readStale && process.env.SAVE_TO_FILE === 'true';


function getFilePath(path) {
  let cleaned = _.replace(path, /\//g, '-' );
  cleaned = _.replace(cleaned, /\?/g, '-');
  cleaned = _.replace(cleaned, /\&/g, '-');
  cleaned = _.replace(cleaned, /\./g, '-');
  cleaned = _.replace(cleaned, /\=/g, '-');
  return `data/scraped/${cleaned}.json`;
}
export async function fetchPage(path) {
  const url= `${baseUrl}/${path}`;
  if (readStale) {
    console.log('Using FS "cache" for ', getFilePath(path));
    return fs.readFileSync(getFilePath(path));
  }
  const response = await fetch(`${url}`);
  const body = await response.text();
  if (saveToFile) {
    fs.writeFileSync(getFilePath(path), normalizeNewline(body));
  }
  return body;
}

export async function fetchArticlePage({ newsId, pageId }, options) {
  const articleUrl = `en/index.php?strPageID=${pageId}&newsID=${newsId}`;
  const article =  await fetchPage(articleUrl, options);
  return article;
}
