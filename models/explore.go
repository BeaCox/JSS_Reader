package models

// Explore struct
type Explore struct {
	Eid         uint   `json:"eid" gorm:"primaryKey;autoIncrement"`
	Category    string `json:"category" gorm:"uniqueIndex:unique_group;type:varchar(255)"`
	Name        string `json:"name" gorm:"uniqueIndex:unique_group;type:varchar(255)"`
	Url         string `json:"url" gorm:"uniqueIndex:unique_group;type:varchar(255)"`
	Description string `json:"description" gorm:"type:varchar(255)"`
	Image       string `json:"image" gorm:"type:varchar(255)"`
}
