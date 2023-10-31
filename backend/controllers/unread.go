package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/helpers/authorize"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

func ReadFeedItem(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// have just one item
	iid := c.Params("iid")
	if iid == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if !authorize.UidIid(user.Id, iid) {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	var item models.FeedItem
	database.DB.Where("iid = ?", iid).First(&item)

	database.DB.Model(&item).Update("unread", 0)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UnreadFeedItem(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// have just one item
	iid := c.Params("iid")
	if iid == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if !authorize.UidIid(user.Id, iid) {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	var item models.FeedItem
	database.DB.Where("iid = ?", iid).First(&item)

	database.DB.Model(&item).Update("unread", 1)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func ReadFeedItemsOfFeed(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	fid := c.Params("fid")
	if fid == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	// get all items of feed
	var items []models.FeedItem
	database.DB.Where("fid = ?", fid).Find(&items)

	for _, item := range items {
		// convert uint to string
		iid_uint := item.Iid
		iid := strconv.FormatUint(uint64(iid_uint), 10)
		if !authorize.UidIid(user.Id, iid) {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}

		database.DB.Model(&item).Update("unread", 0)
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UnreadFeedItemsOfFeed(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	fid := c.Params("fid")
	if fid == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	// get all items of feed
	var items []models.FeedItem
	database.DB.Where("fid = ?", fid).Find(&items)

	for _, item := range items {
		// convert uint to string
		iid_uint := item.Iid
		iid := strconv.FormatUint(uint64(iid_uint), 10)
		if !authorize.UidIid(user.Id, iid) {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}

		database.DB.Model(&item).Update("unread", 1)
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func ReadAllFeedItems(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	items := getAllItemOfUser(user.Id)

	for _, item := range items {
		database.DB.Model(&item).Update("unread", 0)
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UnreadAllFeedItems(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	items := getAllItemOfUser(user.Id)

	for _, item := range items {
		database.DB.Model(&item).Update("unread", 1)
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func getAllItemOfUser(uid uint) []models.FeedItem {
	// get all categories of user
	var categories []models.Category
	database.DB.Where("uid = ?", uid).Find(&categories)

	if len(categories) == 0 {
		return nil
	}

	// get all feeds of categories
	var feeds []models.Feed
	for _, category := range categories {
		var temp []models.Feed
		database.DB.Where("cid = ?", category.Cid).Find(&temp)
		feeds = append(feeds, temp...)
	}

	if len(feeds) == 0 {
		return nil
	}

	// get all items of feeds
	var items []models.FeedItem
	for _, feed := range feeds {
		var temp []models.FeedItem
		database.DB.Where("fid = ?", feed.Fid).Find(&temp)
		items = append(items, temp...)
	}

	return items
}
