package main

import (
	"JSS_Reader/database"
	"JSS_Reader/helpers/explore"
	"JSS_Reader/helpers/rssParser"
	"JSS_Reader/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func main() {
	database.Connect()
	database.RedisInit()
	if err := explore.Init(); err != nil {
		panic(err)
	}

	app := fiber.New()

	if err := godotenv.Load("../.env"); err != nil {
		panic("could not load env variables")
	}
	REMOTE_URL := os.Getenv("REMOTE_URL")
	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin",
		AllowOrigins:     "http://localhost:3000, " + REMOTE_URL,
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))

	routes.Setup(app)
	app.Static("/images", "./resources/images")

	// one routine to update explore
	// another routine to update rss for all users
	// another routine to run the server
	go explore.TimelyUpdate()
	go rssParser.TimelyUpdate()

	log.Print("\n             _        _           _                            _           _            _                _            _            _      \n            /\\ \\     / /\\        / /\\                         /\\ \\        /\\ \\         / /\\             /\\ \\         /\\ \\         /\\ \\    \n            \\ \\ \\   / /  \\      / /  \\                       /  \\ \\      /  \\ \\       / /  \\           /  \\ \\____   /  \\ \\       /  \\ \\   \n            /\\ \\_\\ / / /\\ \\__  / / /\\ \\__                   / /\\ \\ \\    / /\\ \\ \\     / / /\\ \\         / /\\ \\_____\\ / /\\ \\ \\     / /\\ \\ \\  \n           / /\\/_// / /\\ \\___\\/ / /\\ \\___\\                 / / /\\ \\_\\  / / /\\ \\_\\   / / /\\ \\ \\       / / /\\/___  // / /\\ \\_\\   / / /\\ \\_\\ \n  _       / / /   \\ \\ \\ \\/___/\\ \\ \\ \\/___/                / / /_/ / / / /_/_ \\/_/  / / /  \\ \\ \\     / / /   / / // /_/_ \\/_/  / / /_/ / / \n /\\ \\    / / /     \\ \\ \\       \\ \\ \\                     / / /__\\/ / / /____/\\    / / /___/ /\\ \\   / / /   / / // /____/\\    / / /__\\/ /  \n \\ \\_\\  / / /  _    \\ \\ \\  _    \\ \\ \\    ___________    / / /_____/ / /\\____\\/   / / /_____/ /\\ \\ / / /   / / // /\\____\\/   / / /_____/   \n / / /_/ / /  /_/\\__/ / / /_/\\__/ / /___/__________/\\  / / /\\ \\ \\  / / /______  / /_________/\\ \\ \\\\ \\ \\__/ / // / /______  / / /\\ \\ \\     \n/ / /__\\/ /   \\ \\/___/ /  \\ \\/___/ //__________    \\ \\/ / /  \\ \\ \\/ / /_______\\/ / /_       __\\ \\_\\\\ \\___\\/ // / /_______\\/ / /  \\ \\ \\    \n\\/_______/     \\_____\\/    \\_____\\/ \\____\\/    \\____\\/\\/_/    \\_\\/\\/__________/\\_\\___\\     /____/_/ \\/_____/ \\/__________/\\/_/    \\_\\/    \n                                                                                                                                          \n")

	if err := app.Listen(":8000"); err != nil {
		panic(err)
	}
}
