package models

// Category struct
type Category struct {
	Cid  uint   `json:"cid" gorm:"primaryKey;autoIncrement"`
	Uid  uint   `json:"-" gorm:"uniqueIndex:unique_group"`
	Name string `json:"name" validate:"required, min=1, max=20" gorm:"uniqueIndex:unique_group;type:varchar(255)"`
	Feed []Feed `json:"-" gorm:"foreignKey:Cid;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
