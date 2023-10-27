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
		Update()
		time.Sleep(12 * time.Hour)
	}
}

// parse the feeds in explore table
// and update subtitle and image
func Update() {
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
		feed.Description = feedParsed.Description
		if feedParsed.Image != nil {
			feed.Image = feedParsed.Image.URL
		}
		database.DB.Save(&feed)
	}
}
