package explore

import (
	"JSS_Reader/database"
	"JSS_Reader/models"
	"context"
	"github.com/mmcdole/gofeed"
	"time"
)

func TimelyUpdate() {
	for {
		update()
		time.Sleep(12 * time.Hour)
	}
}

// parse the feeds in explore table
// and update subtitle and image
func update() {
	// get all feeds in explore table
	var exploreFeeds []models.Explore
	database.DB.Find(&exploreFeeds)

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	fp := gofeed.NewParser()
	for _, feed := range exploreFeeds {
		// parse the feed
		feedParsed, err := fp.ParseURLWithContext(feed.Url, ctx)
		if err != nil {
			continue
		}
		// update subtitle and image
		if feedParsed.Description != "" {
			feed.Description = feedParsed.Description
		}
		if feedParsed.Image != nil {
			feed.Image = feedParsed.Image.URL
		}
		// just change the subtitle and image
		database.DB.Model(&feed).Updates(models.Explore{Description: feed.Description, Image: feed.Image})
	}
}
