package rssParser

import (
	"JSS_Reader/models"
	"time"
)

func FilterFeedItemsByDate(feedItems []models.FeedItem, updatedDuring string) []models.FeedItem {
	var filteredItems []models.FeedItem
	now := time.Now()
	// updatedDuring by date
	switch updatedDuring {
	case "today":
		for _, item := range feedItems {
			if item.Published.Year() == now.Year() && item.Published.Month() == now.Month() && item.Published.Day() == now.Day() {
				filteredItems = append(filteredItems, item)
			}
		}
	case "week":
		for _, item := range feedItems {
			if item.Updated.After(now.AddDate(0, 0, -7)) {
				filteredItems = append(filteredItems, item)
			}
		}
	case "month":
		for _, item := range feedItems {
			if item.Updated.After(now.AddDate(0, -1, 0)) {
				filteredItems = append(filteredItems, item)
			}
		}
	default:
		return feedItems
	}

	return filteredItems
}

func FilterFeedItemsByTag(feedItems []models.FeedItem, tag string) []models.FeedItem {
	var filteredItems []models.FeedItem
	switch {
	case tag == "starred":
		for _, item := range feedItems {
			if item.Starred {
				filteredItems = append(filteredItems, item)
			}
		}
	case tag == "unread":
		for _, item := range feedItems {
			if item.Unread {
				filteredItems = append(filteredItems, item)
			}
		}
	default:
		return feedItems
	}
	return filteredItems
}
