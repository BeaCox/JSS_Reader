package routes

import (
	"JSS_Reader/controllers"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	// basic routes
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Post("/api/logout", controllers.Logout)

	app.Get("/api/user", controllers.User)

}
