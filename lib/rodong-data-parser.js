import cheerio from "cheerio";
import _ from "lodash";
import { baseUrl } from "./rodong-data-fetcher";

export function parseArticlePage(html, pageData) {
  const $ = cheerio.load(html);
  // body > center > table > tr > td > p.ArticleContent
  const mainContentList = $("td > p.ArticleContent").toArray();
  const parsedArticleItems = _.map(mainContentList, (contentItem, idx) => {
    if (idx === 0) {
      return {
        type: "title",
        data: $(contentItem).text(),
      };
    }
    if (!_.isEmpty($(contentItem).find("img").attr("src"))) {
      const imageElement = $(contentItem).find("img");
      const relativePath = imageElement.attr("src");
      if(_.includes(relativePath, '/photo')) {
        const width = imageElement.attr('width');
        const height = imageElement.attr('height');
        return {
          type: "image",
          data: {
            relativePath: relativePath,
            fullOriginalUrl: `${baseUrl}${relativePath}`,
            height,
            width,
          },
        };
      }
      return {
        type: "image",
        data: undefined,
      };
    }
    return {
      type: "text",
      data: $(contentItem).text(),
    };
  });

  const rawTexts = _.map(_.filter(parsedArticleItems, { type: "text" }), "data");

  return {
    pageId: pageData.pageId,
    newsId: pageData.newsId,
    id: `${pageData.pageId}.${pageData.newsId}`,
    title: _.get(_.find(parsedArticleItems, { type: "title" }), "data"),
    paragraphs: _.filter(rawTexts, text => !_.isEmpty(text.trim())),
  };
}

export function parseNewsListPage(html) {
  const $ = cheerio.load(html);

  const newsListContainer = $(".ListNewsContainer");

  const newsItems = newsListContainer.find(".ListNewsLineContainer");
  const links = _.compact(
    _.map(newsItems, (newsItemElem) => {
      const dateStr = $(newsItemElem).find(".ListNewsLineDate").text();
      const title = $(newsItemElem).find(".ListNewsLineTitleW > a").text();
      const hrefRaw = $(newsItemElem)
        .find(".ListNewsLineTitleW > a")
        .attr("href");
      const href = parseRodongLink(hrefRaw);
      const hasImage = !_.isEmpty(
        $(newsItemElem).find(".ListNewsLineTitleW > img").attr("src")
      );
      return {
        dateStr,
        title,
        page: href,
        hasImage,
      };
    })
  );
  return {
    links,
  };
}

function parseRodongLink(rawHref = "") {
  const href = parseRawHref(_.replace(rawHref, "&amp;", "&"));
  if (_.includes(href, "strPageID=") && _.includes(href, "newsID=")) {
    const qString = _.includes(href, "?")
      ? href.substring(href.indexOf("?") + 1)
      : href;
    const parts = _.map(_.split(qString, "&"), (kvpStr) => {
      const kvp = _.split(kvpStr, "=", 2);
      return {
        key: kvp[0],
        value: kvp[1],
      };
    });
    const newsId = _.find(parts, { key: "newsID" }).value;
    const pageId = _.find(parts, { key: "strPageID" }).value;
    return {
      href,
      newsId,
      pageId,
    };
  }

  return {
    href,
  };
}

function parseRawHref(hrefIn) {
  const matchString = "javascript:article_open('";
  if (_.startsWith(hrefIn, matchString)) {
    return hrefIn.substring(matchString.length, hrefIn.lastIndexOf("')"));
  }
  return hrefIn;
}
