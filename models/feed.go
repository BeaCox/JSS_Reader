package models

// Feed struct
type Feed struct {
	Fid      uint       `json:"fid" gorm:"primaryKey;autoIncrement"`
	Cid      uint       `json:"cid" gorm:"uniqueIndex:unique_group1;uniqueIndex:unique_group2"`
	Url      string     `json:"url" gorm:"uniqueIndex:unique_group1;type:varchar(255);not null"`
	Name     string     `json:"name" gorm:"uniqueIndex:unique_group2;type:varchar(255);not null"`
	FeedItem []FeedItem `json:"-" gorm:"foreignKey:Fid;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
