package rssParser

import (
	"context"
	"github.com/mmcdole/gofeed"
	"net/url"
	"time"
)

func IsValidFeed(feed string) bool {
	// if url encoded, decode it
	feed, err := url.QueryUnescape(feed)
	if err != nil {
		return false
	}

	// check if feed is valid rss feed, timeout after 20 seconds
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	// check if feed is valid rss feed
	parser := gofeed.NewParser()

	_, err = parser.ParseURLWithContext(feed, ctx)

	if err != nil {
		return false
	}

	return true
}
