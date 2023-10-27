package rssParser

import (
	"JSS_Reader/models"
	"context"
	"fmt"
	"github.com/mmcdole/gofeed"
	"time"
)

// just parse the feed(s) and return FeedItem structs
func ParseFeed(feedURL string) ([]models.FeedItem, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// parse the feed
	fp := gofeed.NewParser()
	fmt.Println("start parsing: ", feedURL)
	feed, err := fp.ParseURLWithContext(feedURL, ctx)
	fmt.Println("end parsing: ", feedURL)

	if err != nil {
		return nil, err
	}

	// convert the feed items to FeedItem structs
	var feedItems []models.FeedItem

	for _, item := range feed.Items {
		author := ""
		if item.Authors != nil {
			author = item.Authors[0].Name
		}
		if author == "" && feed.Authors != nil {
			author = feed.Authors[0].Name
		}
		feedItem := models.FeedItem{
			Title:       item.Title,
			Url:         item.Link,
			Author:      author,
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
			author := ""
			if item.Authors != nil {
				author = item.Authors[0].Name
			}
			if author == "" && feed.Authors != nil {
				author = feed.Authors[0].Name
			}
			feedItem := models.FeedItem{
				Title:       item.Title,
				Url:         item.Link,
				Author:      author,
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
