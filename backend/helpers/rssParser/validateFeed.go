package rssParser

import (
	"context"
	"github.com/mmcdole/gofeed"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

func IsValidFeedAbsolutely(feed string) bool {
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

func IsValidFeed(feed string) bool {
	// if url encoded, decode it
	feed, err := url.QueryUnescape(feed)
	if err != nil {
		return false
	}

	resp, err := http.Get(feed)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false
	}

	// convert body to lower case
	bodyStr := strings.ToLower(string(body))

	// just check if the body contains one of the rss tags
	if strings.Contains(bodyStr, "<rss") || strings.Contains(bodyStr, "<rdf") || strings.Contains(bodyStr, "<feed") {
		return true
	}

	return false
}
