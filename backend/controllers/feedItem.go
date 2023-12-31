package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/helpers/rssParser"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/gofiber/fiber/v2"
	"log"
)

func GetFeedItemsofFeed(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	fid := c.Params("fid")

	// ensure fid and uid match
	var feed models.Feed
	database.DB.Where("fid = ?", fid).First(&feed)
	// if not found
	if feed.Fid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "feed not found",
		})
	}
	var category models.Category
	database.DB.Where("cid = ?", feed.Cid).First(&category)
	// if not found
	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category not found",
		})
	}
	// if uid not match
	if category.Uid != user.Id {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	order := c.Query("order")
	if order == "oldest" {
		order = "asc"
	} else {
		order = "desc"
	}
	tag := c.Query("tag")
	var items []models.FeedItem
	switch tag {
	case "starred":
		database.DB.Where("fid = ? AND starred = ?", fid, 1).Order("published " + order).Find(&items)
	case "unread":
		database.DB.Where("fid = ? AND unread = ?", fid, 1).Order("published " + order).Find(&items)
	default:
		database.DB.Where("fid = ?", fid).Order("published " + order).Find(&items)
	}

	updatedDuring := c.Query("updatedDuring")
	// updatedDuring items by date
	if updatedDuring != "" {
		items = rssParser.FilterFeedItemsByDate(items, updatedDuring)
	}

	return c.JSON(items)
}

func UpdateFeedItemsofFeed(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	fid := c.Params("fid")

	// ensure fid and uid match

	var feed models.Feed
	database.DB.Where("fid = ?", fid).First(&feed)
	// if not found
	if feed.Fid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "feed not found",
		})
	}
	var category models.Category
	database.DB.Where("cid = ?", feed.Cid).First(&category)
	// if not found
	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category not found",
		})
	}
	// if uid not match
	if category.Uid != user.Id {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}
	// get items by parsing feed url
	items, err := rssParser.ParseFeed(feed.Url)
	if err != nil {
		log.Println("cannot update feed: " + feed.Url + " " + err.Error())
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "cannot update feed",
		})
	}
	// for each item, check if it is already in database
	for _, item := range items {
		var temp models.FeedItem
		database.DB.Where("url = ? and fid = ?", item.Url, fid).First(&temp)
		// if not found, create a new item
		if temp.Iid == 0 {
			item.Fid = feed.Fid
			database.DB.Create(&item)
		}
		// if found, and updated time is different, update the item
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
		// if found, and updated time is the same, do nothing
	}

	order := c.Query("order")
	if order == "oldest" {
		order = "asc"
	} else {
		order = "desc"
	}
	// get items from database
	tag := c.Query("tag")
	var itemsFromDatabase []models.FeedItem
	switch tag {
	case "starred":
		database.DB.Where("fid = ? AND starred = ?", fid, 1).Order("published " + order).Find(&itemsFromDatabase)
	case "unread":
		database.DB.Where("fid = ? AND unread = ?", fid, 1).Order("published " + order).Find(&itemsFromDatabase)
	default:
		database.DB.Where("fid = ?", fid).Order("published " + order).Find(&itemsFromDatabase)
	}

	updatedDuring := c.Query("updatedDuring")
	// updatedDuring items by date
	if updatedDuring != "" {
		itemsFromDatabase = rssParser.FilterFeedItemsByDate(itemsFromDatabase, updatedDuring)
	}

	return c.JSON(itemsFromDatabase)
}

func GetFeedItemsofCategory(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	cid := c.Params("cid")

	// ensure cid and uid match
	var category models.Category
	database.DB.Where("cid = ?", cid).First(&category)
	// if not found
	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category not found",
		})
	}
	// if uid not match
	if category.Uid != user.Id {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	// get all fid of this category
	var feeds []models.Feed
	database.DB.Where("cid = ?", cid).Find(&feeds)

	// get items of all returned feeds
	tag := c.Query("tag")
	var items []models.FeedItem
	switch tag {
	case "starred":
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ? AND starred = ?", feed.Fid, 1).Find(&temp)
			items = append(items, temp...)
		}
	case "unread":
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ? AND unread = ?", feed.Fid, 1).Find(&temp)
			items = append(items, temp...)
		}
	default:
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ?", feed.Fid).Find(&temp)
			items = append(items, temp...)
		}
	}

	updatedDuring := c.Query("updatedDuring")
	// updatedDuring items by date
	if updatedDuring != "" {
		items = rssParser.FilterFeedItemsByDate(items, updatedDuring)
	}

	order := c.Query("order")
	// sort the feed items by updated time
	items = rssParser.SortFeedItemsByPublished(items, order)

	return c.JSON(items)
}

func UpdateFeedItemsofCategory(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	cid := c.Params("cid")

	// ensure cid and uid match
	var category models.Category
	database.DB.Where("cid = ?", cid).First(&category)
	// if not found
	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category not found",
		})
	}
	// if uid not match
	if category.Uid != user.Id {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	// get all fid of this category
	var feeds []models.Feed
	database.DB.Where("cid = ?", cid).Find(&feeds)

	// get items of all returned feeds
	for _, feed := range feeds {
		// get items by parsing feed url
		items, err := rssParser.ParseFeed(feed.Url)
		if err != nil {
			// just skip this feed
			log.Println("cannot update feed: " + feed.Url + " " + err.Error())
			continue
		}
		// for each item, check if it is already in database
		for _, item := range items {
			var temp models.FeedItem
			database.DB.Where("url = ? and fid = ?", item.Url, feed.Fid).First(&temp)
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

	// get items of all returned feeds
	tag := c.Query("tag")
	var items []models.FeedItem
	switch tag {
	case "starred":
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ? AND starred = ?", feed.Fid, 1).Find(&temp)
			items = append(items, temp...)
		}
	case "unread":
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ? AND unread = ?", feed.Fid, 1).Find(&temp)
			items = append(items, temp...)
		}
	default:
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ?", feed.Fid).Find(&temp)
			items = append(items, temp...)
		}
	}

	updatedDuring := c.Query("updatedDuring")
	// updatedDuring items by date
	if updatedDuring != "" {
		items = rssParser.FilterFeedItemsByDate(items, updatedDuring)
	}

	order := c.Query("order")
	// sort the feed items by updated time
	items = rssParser.SortFeedItemsByPublished(items, order)

	return c.JSON(items)
}

func GetAllFeedItems(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// get all cid of this user
	var categories []models.Category
	database.DB.Where("uid = ?", user.Id).Find(&categories)

	if len(categories) == 0 {
		return c.JSON(nil)
	}

	// get all fid of all returned categories
	var feeds []models.Feed
	for _, category := range categories {
		var temp []models.Feed
		database.DB.Where("cid = ?", category.Cid).Find(&temp)
		feeds = append(feeds, temp...)
	}

	if len(feeds) == 0 {
		return c.JSON(nil)
	}

	// get items of all returned feeds
	tag := c.Query("tag")
	var items []models.FeedItem
	switch tag {
	case "starred":
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ? AND starred = ?", feed.Fid, 1).Find(&temp)
			items = append(items, temp...)
		}
	case "unread":
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ? AND unread = ?", feed.Fid, 1).Find(&temp)
			items = append(items, temp...)
		}
	default:
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ?", feed.Fid).Find(&temp)
			items = append(items, temp...)
		}
	}

	updatedDuring := c.Query("updatedDuring")
	// updatedDuring items by date
	if updatedDuring != "" {
		items = rssParser.FilterFeedItemsByDate(items, updatedDuring)
	}

	order := c.Query("order")
	// sort the feed items by updated time
	items = rssParser.SortFeedItemsByPublished(items, order)

	return c.JSON(items)
}

func UpdateAllFeedItems(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// get all cid of this user
	var categories []models.Category
	database.DB.Where("uid = ?", user.Id).Find(&categories)

	if len(categories) == 0 {
		return c.JSON(nil)
	}

	// get all fid of all returned categories
	var feeds []models.Feed
	for _, category := range categories {
		var temp []models.Feed
		database.DB.Where("cid = ?", category.Cid).Find(&temp)
		feeds = append(feeds, temp...)
	}

	if len(feeds) == 0 {
		return c.JSON(nil)
	}

	for _, feed := range feeds {
		// get items by parsing feed url
		items, err := rssParser.ParseFeed(feed.Url)
		if err != nil {
			// just skip this feed
			log.Println("cannot update feed: " + feed.Url + " " + err.Error())
			continue
		}
		// for each item, check if it is already in database
		for _, item := range items {
			var temp models.FeedItem
			database.DB.Where("url = ? and fid = ?", item.Url, feed.Fid).First(&temp)
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

	// get items of all returned feeds
	tag := c.Query("tag")
	var items []models.FeedItem
	switch tag {
	case "starred":
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ? AND starred = ?", feed.Fid, 1).Find(&temp)
			items = append(items, temp...)
		}
	case "unread":
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ? AND unread = ?", feed.Fid, 1).Find(&temp)
			items = append(items, temp...)
		}
	default:
		for _, feed := range feeds {
			var temp []models.FeedItem
			database.DB.Where("fid = ?", feed.Fid).Find(&temp)
			items = append(items, temp...)
		}
	}

	updatedDuring := c.Query("updatedDuring")
	// updatedDuring items by date
	if updatedDuring != "" {
		items = rssParser.FilterFeedItemsByDate(items, updatedDuring)
	}

	order := c.Query("order")
	// sort the feed items by updated time
	items = rssParser.SortFeedItemsByPublished(items, order)

	return c.JSON(items)
}
