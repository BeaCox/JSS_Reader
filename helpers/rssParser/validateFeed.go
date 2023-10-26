package rssParser

import (
	"github.com/mmcdole/gofeed"
	"net/url"
)

func IsValidFeed(feed string) bool {
	// if url encoded, decode it
	feed, err := url.QueryUnescape(feed)
	if err != nil {
		return false
	}

	// check if feed is valid rss feed
	parser := gofeed.NewParser()

	_, err = parser.ParseURL(feed)

	if err != nil {
		return false
	}

	return true
}
