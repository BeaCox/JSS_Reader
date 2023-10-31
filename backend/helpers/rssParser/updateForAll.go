package rssParser

import (
	"JSS_Reader/database"
	"JSS_Reader/models"
	"log"
	"time"
)

func TimelyUpdate() {
	for {
		updateForAllusers()
		time.Sleep(2 * time.Hour)
	}
}

func updateForAllusers() {
	// get all feeds
	var feeds []models.Feed
	database.DB.Find(&feeds)
	if len(feeds) == 0 {
		return
	}

	for _, feed := range feeds {
		// parse the feed
		items, err := ParseFeed(feed.Url)
		if err != nil {
			log.Println(err)
			continue
		}
		// for each item, check if it is already in database
		for _, item := range items {
			var temp models.FeedItem
			database.DB.Where("url = ?", item.Url).First(&temp)
			// if not found, create a new item
			if temp.Iid == 0 {
				item.Fid = feed.Fid
				database.DB.Create(&item)
			}
			// if found and updated time is different, update the item
			if temp.Iid != 0 && temp.Updated != item.Updated {
				database.DB.Model(&temp).Updates(models.FeedItem{
					Title:       item.Title,
					Author:      item.Author,
					Description: item.Description,
					Content:     item.Content,
					Updated:     item.Updated,
					Published:   item.Published,
				})
			}
		}
	}

}
