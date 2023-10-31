package explore

import (
	"JSS_Reader/database"
	"JSS_Reader/models"
	"bufio"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

// use /resouces/explore.sql to init explore table

func Init() error {
	// if there is nothing in explore table, init it
	var exploreFeeds []models.Explore
	database.DB.Find(&exploreFeeds)
	if len(exploreFeeds) == 0 {
		err := importSql()
		if err != nil {
			return err
		}
	} else {
		// if there is something in explore table, drop it and init it
		database.DB.Exec("DROP TABLE explores;")
		if err := database.DB.AutoMigrate(&models.Explore{}); err != nil {
			return err
		}
		err := importSql()
		if err != nil {
			return err
		}
	}
	return nil
}

func importSql() error {
	if err := godotenv.Load("../.env"); err != nil {
		panic("could not load env variables")
	}
	REMOTE_URL := os.Getenv("REMOTE_URL")
	file, err := os.Open("resources/explores/explores.sql")
	if err != nil {
		return err
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		// replace "/path/to/" to REMOTE_URL/images/
		sqlLine := scanner.Text()
		sqlLine = strings.Replace(sqlLine, "/path/to/", REMOTE_URL+"/images/", -1)
		// use gorm to execute sql
		result := database.DB.Exec(sqlLine)
		if result.Error != nil {
			return result.Error
		}
	}
	return nil
}
