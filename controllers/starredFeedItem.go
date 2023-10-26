package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/gofiber/fiber/v2"
)

func GetStarredFeedItems(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// union select category, feed, feedItem using gorm
	var items []models.FeedItem
	database.DB.Raw("SELECT * FROM feed_items WHERE fid IN (SELECT fid FROM feeds WHERE cid IN (SELECT cid FROM categories WHERE uid = ?)) AND starred = 1", user.Id).Scan(&items)

	return c.JSON(items)
}

func StarFeedItems(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// have a lot of items
	var data map[string][]int

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	// ensure uid and iid match
	// ffid's fid should be in user's feeds, and feeds' cid should be in user's categories

	var items []models.FeedItem

	for _, iid := range data["iid"] {
		var item models.FeedItem
		database.DB.Where("iid = ?", iid).First(&item)
		if item.Iid == 0 {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}
		var feed models.Feed
		database.DB.Where("fid = ?", item.Fid).First(&feed)
		if feed.Fid == 0 {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}
		var category models.Category
		database.DB.Where("cid = ?", feed.Cid).First(&category)
		if category.Cid == 0 {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}
		if category.Uid != user.Id {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}
		items = append(items, item)
	}

	for _, item := range items {
		database.DB.Model(&item).Update("starred", 1)
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UnstarFeedItems(c *fiber.Ctx) error {
	var cookie = c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// have a lot of items
	var data map[string][]int

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	// ensure uid and iid match
	// ffid's fid should be in user's feeds, and feeds' cid should be in user's categories

	var items []models.FeedItem

	for _, iid := range data["iid"] {
		var item models.FeedItem
		database.DB.Where("iid = ?", iid).First(&item)
		if item.Iid == 0 {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}
		var feed models.Feed
		database.DB.Where("fid = ?", item.Fid).First(&feed)
		if feed.Fid == 0 {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}
		var category models.Category
		database.DB.Where("cid = ?", feed.Cid).First(&category)
		if category.Cid == 0 {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}
		if category.Uid != user.Id {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthorized",
			})
		}
		items = append(items, item)
	}

	for _, item := range items {
		database.DB.Model(&item).Update("starred", 0)
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
