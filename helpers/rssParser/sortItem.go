package rssParser

import "JSS_Reader/models"

// sort the feed items by updated time, the latest one is at the first
func SortFeedItemsByUpdated(feedItems []models.FeedItem) []models.FeedItem {
	// sort the feed items by updated time

	// bubble sort
	for i := 0; i < len(feedItems)-1; i++ {
		for j := 0; j < len(feedItems)-1-i; j++ {
			if feedItems[j].Updated.Before(feedItems[j+1].Updated) {
				feedItems[j], feedItems[j+1] = feedItems[j+1], feedItems[j]
			}
		}
	}

	return feedItems
}

func SortFeedItemsByPublished(feedItems []models.FeedItem) []models.FeedItem {
	// sort the feed items by updated time

	// bubble sort
	for i := 0; i < len(feedItems)-1; i++ {
		for j := 0; j < len(feedItems)-1-i; j++ {
			if feedItems[j].Published.Before(feedItems[j+1].Published) {
				feedItems[j], feedItems[j+1] = feedItems[j+1], feedItems[j]
			}
		}
	}

	return feedItems
}
