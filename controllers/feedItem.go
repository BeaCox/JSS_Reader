package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/helpers/rssParser"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/gofiber/fiber/v2"
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

	// get items from database
	var items []models.FeedItem
	database.DB.Where("fid = ?", fid).Find(&items)

	updatedDuring := c.Query("updatedDuring")

	// updatedDuring items by date
	if updatedDuring != "" {
		items = rssParser.FilterFeedItemsByDate(items, updatedDuring)
	}

	// sort items by updated time
	items = rssParser.SortFeedItemsByUpdated(items)

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
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not parse feed",
		})
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
		// if found, update the item
		if temp.Iid != 0 {
			item.Iid = temp.Iid
			database.DB.Model(&item).Updates(models.FeedItem{
				Unread:      temp.Unread,
				Starred:     temp.Starred,
				Url:         temp.Url,
				Title:       temp.Title,
				Description: temp.Description,
				Content:     temp.Content,
				Updated:     temp.Updated,
				Published:   temp.Published,
			})
		}
	}

	// get items from database
	var newItems []models.FeedItem
	database.DB.Where("fid = ?", fid).Find(&newItems)

	// sort items by updated time
	items = rssParser.SortFeedItemsByUpdated(items)

	return c.JSON(newItems)
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
	var items []models.FeedItem
	for _, feed := range feeds {
		var temp []models.FeedItem
		database.DB.Where("fid = ?", feed.Fid).Find(&temp)
		items = append(items, temp...)
	}

	updatedDuring := c.Query("updatedDuring")
	// updatedDuring items by date
	if updatedDuring != "" {
		items = rssParser.FilterFeedItemsByDate(items, updatedDuring)
	}

	// sort items by updated time
	items = rssParser.SortFeedItemsByUpdated(items)

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
			c.Status(fiber.StatusInternalServerError)
			return c.JSON(fiber.Map{
				"message": "could not parse feed",
			})
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
			// if found, update the item
			if temp.Iid != 0 {
				item.Iid = temp.Iid
				database.DB.Model(&item).Updates(models.FeedItem{
					Unread:      temp.Unread,
					Starred:     temp.Starred,
					Url:         temp.Url,
					Title:       temp.Title,
					Description: temp.Description,
					Content:     temp.Content,
					Updated:     temp.Updated,
					Published:   temp.Published,
				})
			}
		}
	}

	// get items of all returned feeds
	var items []models.FeedItem
	for _, feed := range feeds {
		var temp []models.FeedItem
		database.DB.Where("fid = ?", feed.Fid).Find(&temp)
		items = append(items, temp...)
	}

	// sort items by updated time
	items = rssParser.SortFeedItemsByUpdated(items)

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

	// get all fid of all returned categories
	var feeds []models.Feed
	for _, category := range categories {
		var temp []models.Feed
		database.DB.Where("cid = ?", category.Cid).Find(&temp)
		feeds = append(feeds, temp...)
	}

	// get items of all returned feeds
	var items []models.FeedItem
	for _, feed := range feeds {
		var temp []models.FeedItem
		database.DB.Where("fid = ?", feed.Fid).Find(&temp)
		items = append(items, temp...)
	}

	updatedDuring := c.Query("updatedDuring")
	// updatedDuring items by date
	if updatedDuring != "" {
		items = rssParser.FilterFeedItemsByDate(items, updatedDuring)
	}

	// sort items by updated time
	items = rssParser.SortFeedItemsByUpdated(items)

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

	// get all fid of all returned categories
	var feeds []models.Feed
	for _, category := range categories {
		var temp []models.Feed
		database.DB.Where("cid = ?", category.Cid).Find(&temp)
		feeds = append(feeds, temp...)
	}

	// get items of all returned feeds
	for _, feed := range feeds {
		// get items by parsing feed url
		items, err := rssParser.ParseFeed(feed.Url)
		if err != nil {
			c.Status(fiber.StatusInternalServerError)
			return c.JSON(fiber.Map{
				"message": "could not parse feed",
			})
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
			// if found, update the item
			if temp.Iid != 0 {
				item.Iid = temp.Iid
				database.DB.Model(&item).Updates(models.FeedItem{
					Unread:      temp.Unread,
					Starred:     temp.Starred,
					Url:         temp.Url,
					Title:       temp.Title,
					Description: temp.Description,
					Content:     temp.Content,
					Updated:     temp.Updated,
					Published:   temp.Published,
				})
			}
		}
	}

	// get items of all returned feeds
	var items []models.FeedItem
	for _, feed := range feeds {
		var temp []models.FeedItem
		database.DB.Where("fid = ?", feed.Fid).Find(&temp)
		items = append(items, temp...)
	}

	// sort items by updated time
	items = rssParser.SortFeedItemsByUpdated(items)

	return c.JSON(items)
}
