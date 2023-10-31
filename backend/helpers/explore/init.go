package explore

import (
	"JSS_Reader/database"
	"JSS_Reader/models"
	"bufio"
	"os"
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

	file, err := os.Open("resources/explores.sql")
	if err != nil {
		return err
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		// use gorm to execute sql
		result := database.DB.Exec(scanner.Text())
		if result.Error != nil {
			return result.Error
		}
	}
	return nil
}
