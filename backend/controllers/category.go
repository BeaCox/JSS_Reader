package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/gofiber/fiber/v2"
)

func CreateCategory(c *fiber.Ctx) error {
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

	if data["name"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	category := models.Category{
		Uid:  user.Id,
		Name: data["name"],
	}

	// check if the category has already been created
	database.DB.Where("uid = ? AND name = ?", user.Id, data["name"]).First(&category)

	if category.Cid != 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category already exists",
		})
	}

	database.DB.Create(&category)

	return c.JSON(category)
}

func GetCategories(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var categories []models.Category

	database.DB.Where("uid = ?", user.Id).Find(&categories)

	return c.JSON(categories)
}

func UpdateCategory(c *fiber.Ctx) error {
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

	if data["name"] == "" || data["newName"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	var category models.Category

	database.DB.Where("uid = ? AND name = ?", user.Id, data["name"]).First(&category)

	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category does not exist",
		})
	}

	// check if the new name has already been created
	var existingCategory models.Category

	database.DB.Where("uid = ? AND name = ?", user.Id, data["newName"]).First(&existingCategory)

	if existingCategory.Cid != 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category already exists",
		})
	}

	category.Name = data["newName"]

	database.DB.Save(&category)

	return c.JSON(category)
}

func DeleteCategory(c *fiber.Ctx) error {
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

	if data["name"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	var category models.Category

	var feeds []models.Feed

	database.DB.Where("uid = ? AND name = ?", user.Id, data["name"]).First(&category)

	if category.Cid == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "category does not exist",
		})
	}

	// also delete all feeds in the category
	database.DB.Where("cid = ?", category.Cid).Find(&feeds)

	for _, feed := range feeds {
		database.DB.Delete(&feed)
	}

	database.DB.Delete(&category)

	return c.JSON(fiber.Map{
		"message": "category deleted",
	})
}
