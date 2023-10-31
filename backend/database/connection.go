package database

import (
	"JSS_Reader/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"os"
)

var DB *gorm.DB

func Connect() {
	if err := godotenv.Load(); err != nil {
		panic("could not load env variables")
	}

	USER := os.Getenv("DB_USER")
	PASS := os.Getenv("DB_PASSWORD")
	HOST := os.Getenv("DB_HOST")
	DBNAME := os.Getenv("DB_NAME")

	mysqlDSN := USER + ":" + PASS + "@tcp(" + HOST + ")/" + DBNAME + "?charset=utf8mb4&parseTime=True&loc=Local"
	connection, err := gorm.Open(mysql.Open(mysqlDSN), &gorm.Config{})

	if err != nil {
		panic("could not connect to the database")
	}
	log.Print("connected to mysql")

	DB = connection

	if err := connection.AutoMigrate(&models.User{}); err != nil {
		panic("could not migrate the database")
	}
	if err := connection.AutoMigrate(&models.Setting{}); err != nil {
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
	if err := connection.AutoMigrate(&models.Explore{}); err != nil {
		panic("could not migrate the database")
	}
}
