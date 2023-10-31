package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/gofiber/fiber/v2"
	"net/url"
)

func GetExplore(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	_, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	// url decode
	category := c.Params("category")
	category, err = url.QueryUnescape(category)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	// get items from database
	var exploreFeeds []models.Explore
	database.DB.Where("category = ?", category).Find(&exploreFeeds)
	return c.JSON(exploreFeeds)
}
