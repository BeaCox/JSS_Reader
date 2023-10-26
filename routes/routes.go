package routes

import (
	"JSS_Reader/controllers"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	// basic routes
	app.Post("/api/v1/register", controllers.Register)
	app.Post("/api/v1/login", controllers.Login)
	app.Post("/api/v1/logout", controllers.Logout)
	app.Get("/api/v1/cancel", controllers.Cancel)

	// mail verify
	app.Post("/api/v1/sendMailCode", controllers.SendMailCode)

	app.Get("/api/v1/user", controllers.User)

	// category crud routes
	app.Post("/api/v1/category", controllers.CreateCategory)
	app.Get("/api/v1/category", controllers.GetCategories)
	app.Put("/api/v1/category", controllers.UpdateCategory)
	app.Delete("/api/v1/category", controllers.DeleteCategory)

	// feed crud route
	app.Post("/api/v1/feed/category/:name", controllers.CreateFeed)
	app.Get("/api/v1/feed/category/:name", controllers.GetFeeds)
	app.Put("/api/v1/feed/category/:name", controllers.UpdateFeed)
	app.Delete("/api/v1/feed/category/:name", controllers.DeleteFeed)

	// get item is from database
	// update item is requesting feeds and update database, then return items
	// feed item routes for one feed
	app.Get("/api/v1/item/one/get/:fid", controllers.GetFeedItemsofFeed)
	app.Get("/api/v1/item/one/update/:fid", controllers.UpdateFeedItemsofFeed)
	// categorized feed items route
	app.Get("/api/v1/item/category/get/:cid", controllers.GetFeedItemsofCategory)
	app.Get("/api/v1/item/category/update/:cid", controllers.UpdateFeedItemsofCategory)
	// all feed items route
	app.Get("/api/v1/item/all/get", controllers.GetAllFeedItems)
	app.Get("/api/v1/item/all/update", controllers.UpdateAllFeedItems)

	// starred feed items route
	app.Get("/api/v1/starred", controllers.GetStarredFeedItems)
	app.Post("/api/v1/star", controllers.StarFeedItems)
	app.Post("/api/v1/unstar", controllers.UnstarFeedItems)

}
