package database

import (
	"JSS_Reader/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"os"
)

var DB *gorm.DB

func Connect() {
	if err := godotenv.Load(); err != nil {
		panic("could not load env variables")
	}

	mysqlDNS := os.Getenv("MYSQL_DNS")
	connection, err := gorm.Open(mysql.Open(mysqlDNS), &gorm.Config{})

	if err != nil {
		panic("could not connect to the database")
	}

	DB = connection

	if err := connection.AutoMigrate(&models.User{}); err != nil {
		panic("could not migrate the database")
	}
	if err := connection.AutoMigrate(&models.Category{}); err != nil {
		panic("could not migrate the database")
	}

	if err := connection.AutoMigrate(&models.Feed{}); err != nil {
		panic("could not migrate the database")
	}
	if err := connection.AutoMigrate(&models.FeedItem{}); err != nil {
		panic("could not migrate the database")
	}

}
