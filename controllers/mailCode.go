package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/helpers/mailVerify"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"github.com/gofiber/fiber/v2"
)

func SendMailCode(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if data["service"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	if data["service"] == "cancel" || data["service"] == "changePassword" {
		cookie := c.Cookies("jwt")

		user, err := middleware.IsAuthenticated(cookie)

		if err != nil {
			c.Status(fiber.StatusUnauthorized)
			return c.JSON(fiber.Map{
				"message": "unauthenticated",
			})
		}

		data["email"] = user.Email
	}

	if data["email"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	if data["service"] == "changeEmail" || data["service"] == "register" {
		var user models.User

		database.DB.Where("email = ?", data["email"]).First(&user)

		if user.Id != 0 {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "email already exists",
			})
		}
	}

	if err := mailVerify.SendCode(data["email"], data["service"]); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
