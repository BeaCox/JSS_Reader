package main

import (
	"JSS_Reader/database"
	"JSS_Reader/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	if err := app.Listen(":3000"); err != nil {
		panic(err)
	}
}
