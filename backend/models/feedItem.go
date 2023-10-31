package models

import "time"

// FeedItem struct
type FeedItem struct {
	Iid     uint `json:"iid" gorm:"primaryKey;autoIncrement"`
	Fid     uint `json:"fid" gorm:"uniqueIndex:unique_group"`
	Unread  bool `json:"unread" gorm:"type:tinyint(1);not null;default:1"`
	Starred bool `json:"starred" gorm:"type:tinyint(1);not null;default:0"`
	// rss properties
	Url         string    `json:"url" gorm:"uniqueIndex:unique_group;type:varchar(255);not null"`
	Title       string    `json:"title" gorm:"type:text;not null"`
	Author      string    `json:"author" gorm:"type:varchar(255);not null"`
	Description string    `json:"description" gorm:"type:mediumtext;not null"`
	Content     string    `json:"content" gorm:"type:mediumtext;not null"`
	Updated     time.Time `json:"updated" gorm:"type:datetime;not null"`
	Published   time.Time `json:"published" gorm:"type:datetime;not null"`
}
