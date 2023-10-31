package rssParser

import (
	"JSS_Reader/models"
	"context"
	"github.com/mmcdole/gofeed"
	"log"
	"time"
)

// just parse the feed(s) and return FeedItem structs
func ParseFeed(feedURL string) ([]models.FeedItem, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	// parse the feed
	fp := gofeed.NewParser()
	log.Println("start parsing: ", feedURL)
	feed, err := fp.ParseURLWithContext(feedURL, ctx)
	log.Println("end parsing: ", feedURL)

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
		updated := time.Now()
		if feed.UpdatedParsed != nil {
			updated = *feed.UpdatedParsed
		}
		if item.UpdatedParsed != nil {
			updated = *item.UpdatedParsed
		}
		published := updated
		if feed.PublishedParsed != nil {
			published = *feed.PublishedParsed
		}
		if item.PublishedParsed != nil {
			published = *item.PublishedParsed
		}
		feedItem := models.FeedItem{
			Title:       item.Title,
			Url:         item.Link,
			Author:      author,
			Description: item.Description,
			Content:     item.Content,
			Updated:     updated,
			Published:   published,
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
			updated := time.Now()
			if feed.UpdatedParsed != nil {
				updated = *feed.UpdatedParsed
			}
			if item.UpdatedParsed != nil {
				updated = *item.UpdatedParsed
			}
			published := updated
			if feed.PublishedParsed != nil {
				published = *feed.PublishedParsed
			}
			if item.PublishedParsed != nil {
				published = *item.PublishedParsed
			}
			feedItem := models.FeedItem{
				Title:       item.Title,
				Url:         item.Link,
				Author:      author,
				Description: item.Description,
				Content:     item.Content,
				Updated:     updated,
				Published:   published,
			}

			feedItems = append(feedItems, feedItem)
		}
	}

	return feedItems, nil
}
