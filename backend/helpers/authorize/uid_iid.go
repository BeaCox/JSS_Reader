package authorize

import (
	"JSS_Reader/database"
	"JSS_Reader/models"
)

func UidIid(uid uint, iid string) bool {
	var item models.FeedItem

	database.DB.Where("iid = ?", iid).First(&item)
	if item.Iid == 0 {
		return false
	}

	var feed models.Feed
	database.DB.Where("fid = ?", item.Fid).First(&feed)
	if feed.Fid == 0 {
		return false
	}

	var category models.Category
	database.DB.Where("cid = ?", feed.Cid).First(&category)
	if category.Cid == 0 {
		return false
	}

	if category.Uid != uid {
		return false
	}

	return true
}
