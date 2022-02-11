import _ from "lodash";
import fs from "fs";
import { fetchPage, fetchArticlePage } from "./rodong-data-fetcher";
import { parseNewsListPage, parseArticlePage } from "./rodong-data-parser";

const config = {
  liveData: process.env.USE_LIVE_DATA !== "false",
  useWebCache: false,
  news: {
    path: "en/index.php?strPageID=SF01_01_02&iMenuID=2",
    fallbackPath: "data/news.html",
  },
  article: {
    fallbackPath: "data/article.html",
  },
};

export async function scrapeSite() {
  const newsList = await scrapeNewsPage(
    config.news.path,
    config.news.fallbackPath
  );
  const newsItems = _.take(newsList.links, 3);
  const fetchedItems = await Promise.all(
    _.map(newsItems, async (item) => {
      if (item.page && item.page.newsId) {
        const articlePage = await scrapeArticlePage(item.page);
        return {
          ...item,
          article: articlePage,
        };
      }
      return undefined;
    })
  );

  return {
    links: _.compact(fetchedItems),
  };
}

export async function scrapeArticlePage(page) {
  const data = config.liveData
    ? await fetchArticlePage(page, { useCache: config.useWebCache })
    : fs.readFileSync(config.article.fallbackPath);
  return parseArticlePage(data, page);
}

export async function scrapeNewsPage(path = config.news, fallbackPath) {
  const data = config.liveData
    ? await fetchPage(path, { useCache: config.useWebCache })
    : fs.readFileSync(fallbackPath);
  return parseNewsListPage(data);
}
