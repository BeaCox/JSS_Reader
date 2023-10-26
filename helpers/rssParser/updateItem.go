package rssParser

import (
	"JSS_Reader/models"
	"github.com/mmcdole/gofeed"
)

// just parse the feed(s) and return FeedItem structs
func ParseFeed(feedURL string) ([]models.FeedItem, error) {
	// parse the feed
	fp := gofeed.NewParser()

	feed, err := fp.ParseURL(feedURL)

	if err != nil {
		return nil, err
	}

	// convert the feed items to FeedItem structs
	var feedItems []models.FeedItem

	for _, item := range feed.Items {
		feedItem := models.FeedItem{
			Title:       item.Title,
			Url:         item.Link,
			Description: item.Description,
			Content:     item.Content,
			Updated:     *item.UpdatedParsed,
			Published:   *item.PublishedParsed,
		}

		feedItems = append(feedItems, feedItem)
	}

	return feedItems, nil
}

func ParseFeeds(feedURLs []string) ([]models.FeedItem, error) {
	// parse the feed
	fp := gofeed.NewParser()

	var feedItems []models.FeedItem

	for _, feedURL := range feedURLs {
		feed, err := fp.ParseURL(feedURL)

		if err != nil {
			return nil, err
		}

		// convert the feed items to FeedItem structs
		for _, item := range feed.Items {
			feedItem := models.FeedItem{
				Title:       item.Title,
				Url:         item.Link,
				Description: item.Description,
				Content:     item.Content,
				Updated:     *item.UpdatedParsed,
				Published:   *item.PublishedParsed,
			}

			feedItems = append(feedItems, feedItem)
		}
	}

	return feedItems, nil
}
