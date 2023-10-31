package middleware

import (
	"JSS_Reader/database"
	"JSS_Reader/models"
	"github.com/dgrijalva/jwt-go/v4"
	"os"
)

func IsAuthenticated(cookie string) (models.User, error) {
	// parse the jwt
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	// validate the token
	if err != nil {
		return models.User{}, err
	}

	// validate the claims
	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	database.DB.Where("id = ?", claims.Issuer).First(&user)

	if user.Id == 0 {
		return models.User{}, err
	}

	return user, nil
}
