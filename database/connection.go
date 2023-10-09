package database

import (
	"JSS_Reader/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	connection, err := gorm.Open(mysql.Open("root:beacox@/jss_reader"), &gorm.Config{})

	if err != nil {
		panic("could not connect to the database")
	}

	DB = connection

	if err := connection.AutoMigrate(&models.User{}); err != nil {
		panic("could not migrate the database")
	}
}
