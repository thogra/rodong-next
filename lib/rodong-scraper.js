import _ from "lodash";
import { fetchPage, fetchArticlePage } from "./rodong-data-fetcher";
import { parseNewsListPage, parseArticlePage } from "./rodong-data-parser";

const config = {
  useWebCache: false,
  news: {
    path: "en/index.php?strPageID=SF01_01_02&iMenuID=2",
  },
  article: {},
};

export async function scrapeSite() {
  const newsList = await scrapeNewsPage(config.news.path);
  const newsItems = _.take(newsList.links, 10);
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
  const data = await fetchArticlePage(page);
  return parseArticlePage(data, page);
}

export async function scrapeNewsPage(path = config.news) {
  const data = await fetchPage(path);
  return parseNewsListPage(data);
}
