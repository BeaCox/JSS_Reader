package models

// User struct
type User struct {
	Id       uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	Username string     `json:"username" gorm:"not null"`
	Email    string     `validate:"required, email" json:"email" gorm:"unique;not null"`
	Password []byte     `validate:"required, min=8, max=64" json:"-" gorm:"not null"`
	Category []Category `json:"-" gorm:"foreignKey:Uid;constraint:OnDelete:CASCADE;"`
	// one user has one setting
	Setting Setting `json:"-" gorm:"foreignKey:Uid;constraint:OnDelete:CASCADE;"`
}
