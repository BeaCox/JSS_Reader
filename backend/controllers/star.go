package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/helpers/authorize"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/gofiber/fiber/v2"
)

func StarFeedItem(c *fiber.Ctx) error {
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

	database.DB.Model(&item).Update("starred", 1)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UnstarFeedItem(c *fiber.Ctx) error {
	var cookie = c.Cookies("jwt")

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

	database.DB.Model(&item).Update("starred", 0)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
