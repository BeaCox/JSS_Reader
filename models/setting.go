package models

// Setting struct
type Setting struct {
	Uid                 uint `json:"uid" gorm:"primaryKey;autoIncrement"`
	StartPage           uint `validate:"min=1, max=4" json:"start_page" gorm:"type:tinyint(1);not null;default:1"`
	DefaultSort         uint `validate:"min=1, max=2" json:"default_sort" gorm:"type:tinyint(1);not null;default:1"`
	DefaultPresentation uint `validate:"min=1, max=3" json:"default_presentation" gorm:"type:tinyint(1);not null;default:1"`
	MarkAsReadOnScroll  uint `validate:"min=1, max=2" json:"mark_as_read_on_scroll" gorm:"type:tinyint(1);not null;default:1"`
	FontSize            uint `validate:"min=1, max=3" json:"font_size" gorm:"type:tinyint(1);not null;default:2"`
	FontFamily          uint `validate:"min=1, max=3" json:"font_family" gorm:"type:tinyint(1);not null;default:1"`
	Theme               uint `validate:"min=1, max=3" json:"theme" gorm:"type:tinyint(1);not null;default:1"`
	DisplayDensity      uint `validate:"min=1, max=3" json:"display_density" gorm:"type:tinyint(1);not null;default:1"`
}
