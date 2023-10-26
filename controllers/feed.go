package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/helpers/rssParser"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/gofiber/fiber/v2"
	"net/url"
)

func CreateFeed(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	cname := c.Params("name")

	cname, err = url.QueryUnescape(cname)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if data["name"] == "" || data["url"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	var category models.Category

	database.DB.Where("name = ? AND uid = ?", cname, user.Id).First(&category)

	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category not found",
		})
	}

	if rssParser.IsValidFeed(data["url"]) == false {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "invalid feed url",
		})
	}

	feed := models.Feed{
		Cid:  category.Cid,
		Url:  data["url"],
		Name: data["name"],
	}

	// check if feed already exists
	var existingFeed models.Feed

	database.DB.Where("cid = ? AND url = ?", feed.Cid, feed.Url).First(&existingFeed)

	if existingFeed.Fid != 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "feed already exists",
		})
	}

	database.DB.Where("cid = ? AND name = ?", feed.Cid, feed.Name).First(&existingFeed)

	if existingFeed.Fid != 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "feed already exists",
		})
	}

	database.DB.Create(&feed)

	return c.JSON(feed)
}

func GetFeeds(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	cname := c.Params("name")

	cname, err = url.QueryUnescape(cname)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	var category models.Category

	database.DB.Where("name = ? AND uid = ?", cname, user.Id).First(&category)

	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category not found",
		})
	}

	var feeds []models.Feed

	database.DB.Where("cid = ?", category.Cid).Find(&feeds)

	return c.JSON(feeds)
}

func UpdateFeed(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	cname := c.Params("name")

	cname, err = url.QueryUnescape(cname)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	var category models.Category

	database.DB.Where("name = ? AND uid = ?", cname, user.Id).First(&category)

	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category not found",
		})
	}

	// use Fid to update feed

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if (data["newName"] == "" && data["newUrl"] == "") || data["fid"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	if data["newUrl"] != "" && rssParser.IsValidFeed(data["newUrl"]) == false {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "invalid feed url",
		})
	}

	fid := data["fid"]

	var feed models.Feed

	database.DB.Where("fid = ? AND cid = ?", fid, category.Cid).First(&feed)

	if feed.Fid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "feed not found",
		})
	}

	// check if feed already exists

	var existingFeed models.Feed

	database.DB.Where("cid = ? AND url = ? AND fid != ?", feed.Cid, data["newUrl"], feed.Fid).First(&existingFeed)

	if existingFeed.Fid != 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "there is already a feed with this url",
		})
	}

	database.DB.Where("(cid = ? AND name = ? AND fid != ? ) OR (cid = ? AND url = ? AND fid != ?)", feed.Cid, data["newName"], feed.Fid, feed.Cid, data["newUrl"], feed.Fid).First(&existingFeed)

	if existingFeed.Fid != 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "there is already a feed with this name or url",
		})
	}

	if data["newName"] != "" {
		feed.Name = data["newName"]
	}

	if data["newUrl"] != "" {
		feed.Url = data["newUrl"]
	}

	database.DB.Save(&feed)

	return c.JSON(feed)
}

func DeleteFeed(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	cname := c.Params("name")

	cname, err = url.QueryUnescape(cname)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	fid := data["fid"]

	if fid == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	var category models.Category

	database.DB.Where("name = ? AND uid = ?", cname, user.Id).First(&category)

	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category not found",
		})
	}

	var feed models.Feed

	database.DB.Where("fid = ? AND cid = ?", fid, category.Cid).First(&feed)

	if feed.Fid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "feed not found",
		})
	}

	database.DB.Delete(&feed)

	return c.JSON(fiber.Map{
		"message": "feed deleted",
	})
}
