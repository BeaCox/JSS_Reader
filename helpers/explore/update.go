package explore

import (
	"JSS_Reader/database"
	"JSS_Reader/models"
	"context"
	"github.com/mmcdole/gofeed"
	"log"
	"time"
)

func TimelyUpdate() {
	for {
		update()
		time.Sleep(12 * time.Hour)
	}
}

// parse the feeds in explore table
// and update description and image
func update() {
	// get all feeds in explore table
	var exploreFeeds []models.Explore
	database.DB.Find(&exploreFeeds)

	fp := gofeed.NewParser()
	log.Println("--------------------Start update explore--------------------")
	for _, feed := range exploreFeeds {
		// parse the feed
		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		feedParsed, err := fp.ParseURLWithContext(feed.Url, ctx)
		if err != nil {
			log.Println("update explore error: " + feed.Url + " " + err.Error())
			continue
		}
		// update description and image
		if feedParsed.Description != "" {
			// if description is too long, use name instead
			if len(feedParsed.Description) > 2000 {
				feedParsed.Description = feedParsed.Title
			}
			database.DB.Model(&feed).Update("description", feedParsed.Description)
			log.Println("update explore description: " + feed.Name + " " + feedParsed.Description)
		}
		if feedParsed.Image != nil {
			database.DB.Model(&feed).Update("image", feedParsed.Image.URL)
			log.Println("update explore image: " + feed.Name + " " + feedParsed.Image.URL)
		}
		// refresh ctx
		cancel()
	}
	log.Println("--------------------End update explore--------------------")
}
