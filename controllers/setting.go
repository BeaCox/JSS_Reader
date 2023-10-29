package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func GetSetting(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var setting models.Setting
	database.DB.Where("uid = ?", user.Id).First(&setting)

	return c.JSON(setting)
}

func UpdateSetting(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data map[string]uint

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	var setting models.Setting

	database.DB.Where("uid = ?", user.Id).First(&setting)

	validate := validator.New()
	if data["start_page"] != 0 {
		setting.StartPage = data["start_page"]
		err := validate.Struct(setting)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		database.DB.Model(&setting).Update("start_page", data["start_page"])
		return c.JSON(setting)
	}

	if data["default_sort"] != 0 {
		setting.DefaultSort = data["default_sort"]
		err := validate.Struct(setting)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		database.DB.Model(&setting).Update("default_sort", data["default_sort"])
		return c.JSON(setting)
	}

	if data["default_presentation"] != 0 {
		setting.DefaultPresentation = data["default_presentation"]
		err := validate.Struct(setting)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		database.DB.Model(&setting).Update("default_presentation", data["default_presentation"])
		return c.JSON(setting)
	}

	if data["mark_as_read_on_scroll"] != 0 {
		setting.MarkAsReadOnScroll = data["mark_as_read_on_scroll"]
		err := validate.Struct(setting)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		database.DB.Model(&setting).Update("mark_as_read_on_scroll", data["mark_as_read_on_scroll"])
		return c.JSON(setting)
	}

	if data["font_size"] != 0 {
		setting.FontSize = data["font_size"]
		err := validate.Struct(setting)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		database.DB.Model(&setting).Update("font_size", data["font_size"])
		return c.JSON(setting)
	}

	if data["font_family"] != 0 {
		setting.FontFamily = data["font_family"]
		err := validate.Struct(setting)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		database.DB.Model(&setting).Update("font_family", data["font_family"])
		return c.JSON(setting)
	}

	if data["theme"] != 0 {
		setting.Theme = data["theme"]
		err := validate.Struct(setting)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		database.DB.Model(&setting).Update("theme", data["theme"])
		return c.JSON(setting)
	}

	if data["display_density"] != 0 {
		setting.DisplayDensity = data["display_density"]
		err := validate.Struct(setting)
		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		database.DB.Model(&setting).Update("display_density", data["display_density"])
		return c.JSON(setting)
	}

	c.Status(fiber.StatusBadRequest)
	return c.JSON(fiber.Map{
		"message": "bad request",
	})
}
