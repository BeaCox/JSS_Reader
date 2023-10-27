package main

import (
	"JSS_Reader/database"
	"JSS_Reader/helpers/explore"
	"JSS_Reader/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()
	database.RedisInit()
	if err := explore.Init(); err != nil {
		panic(err)
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin",
		AllowOrigins:     "*",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))

	routes.Setup(app)

	// one routine to update explore
	// another routine to run the server
	go explore.TimelyUpdate()

	if err := app.Listen(":8000"); err != nil {
		panic(err)
	}
}
