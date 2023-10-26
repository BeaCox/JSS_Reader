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
			if item.Published.Year() == now.Year() && item.Published.Month() == now.Month() && item.Published.Day() >= now.Day()-7 {
				filteredItems = append(filteredItems, item)
			}
		}
	case "month":
		for _, item := range feedItems {
			if item.Published.Year() == now.Year() && item.Published.Month() == now.Month() {
				filteredItems = append(filteredItems, item)
			}
		}
	default:
		filteredItems = feedItems
	}

	return filteredItems
}
