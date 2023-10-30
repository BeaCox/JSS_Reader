package models

// Setting struct
type Setting struct {
	Uid                 uint `json:"uid" gorm:"primaryKey;autoIncrement"`
	DefaultSort         uint `validate:"max=2,min=1" json:"default_sort" gorm:"type:tinyint(1);not null;default:1"`
	DefaultPresentation uint `validate:"max=3,min=1" json:"default_presentation" gorm:"type:tinyint(1);not null;default:1"`
	MarkAsReadOnScroll  uint `validate:"max=2,min=1" json:"mark_as_read_on_scroll" gorm:"type:tinyint(1);not null;default:1"`
	FontSize            uint `validate:"max=3,min=1" json:"font_size" gorm:"type:tinyint(1);not null;default:2"`
	FontFamily          uint `validate:"max=3,min=1" json:"font_family" gorm:"type:tinyint(1);not null;default:1"`
	Theme               uint `validate:"max=3,min=1" json:"theme" gorm:"type:tinyint(1);not null;default:1"`
	DisplayDensity      uint `validate:"max=3,min=1" json:"display_density" gorm:"type:tinyint(1);not null;default:1"`
}
