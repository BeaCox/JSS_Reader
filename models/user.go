package models

// User struct
type User struct {
	Id       uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	Username string     `json:"username" gorm:"not null"`
	Email    string     `json:"email" validate:"required, email" gorm:"unique;not null"`
	Password []byte     `json:"-" validate:"required, min=8, max=64" gorm:"not null"`
	Category []Category `json:"-" gorm:"foreignKey:Uid;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
