package controllers

import (
	"JSS_Reader/database"
	"JSS_Reader/helpers/mailVerify"
	"JSS_Reader/middleware"
	"JSS_Reader/models"
	"crypto/rand"
	"encoding/base64"
	"github.com/dgrijalva/jwt-go/v4"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"os"
	"strconv"
	"time"
)

func generateRandomString() string {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		panic(err)
	}
	secretKey := base64.StdEncoding.EncodeToString(b)
	// save to .env
	f, err := os.OpenFile(".env", os.O_APPEND|os.O_WRONLY, 0600)
	if err != nil {
		panic(err)
	}
	defer f.Close()
	if _, err = f.WriteString("\nSECRET_KEY=" + secretKey); err != nil {
		panic(err)
	}
	return secretKey
}

func getSecretKey() string {
	if err := godotenv.Load("../.env"); err != nil {
		panic("could not load env variables")
	}

	secretKey := os.Getenv("SECRET_KEY")

	// if not set, use a large random string
	if secretKey == "" {
		secretKey = generateRandomString()
	}

	return secretKey
}

var secretKey = getSecretKey()

func Register(c *fiber.Ctx) error {
	// email is unique, so we should use it to check if the user already exists
	// TBD: check if the email has already been registered
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return err
	}

	if data["username"] == "" || data["email"] == "" || data["password"] == "" || data["code"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	if err := mailVerify.VerifyCode(data["email"], data["code"], "register"); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	user := models.User{
		Username: data["username"],
		Email:    data["email"],
		Password: password,
	}

	database.DB.Create(&user)

	var setting models.Setting
	setting.Uid = user.Id

	database.DB.Create(&setting)

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data["email"] == "" || data["password"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.Id == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "invalid email or password",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "invalid email or password",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.Id)),
		ExpiresAt: jwt.NewTime(float64(time.Now().Add(time.Hour * 24).Unix())), // token will expire in 1 day
	})

	token, err := claims.SignedString([]byte(secretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func Cancel(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if data["code"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	if err := mailVerify.VerifyCode(user.Email, data["code"], "cancel"); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	database.DB.Delete(&user)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func ForgetPassword(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if data["email"] == "" || data["code"] == "" || data["newPassword"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	if err := mailVerify.VerifyCode(data["email"], data["code"], "forgetPassword"); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	password, _ := bcrypt.GenerateFromPassword([]byte(data["newPassword"]), 14)

	database.DB.Model(&user).Update("password", password)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func ChangePassword(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if data["code"] == "" || data["newPassword"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	if err := mailVerify.VerifyCode(user.Email, data["code"], "changePassword"); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["newPassword"]), 14)

	database.DB.Model(&user).Update("password", password)

	// auto logout
	NULLcookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&NULLcookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func ChangeEmail(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if data["code"] == "" || data["email"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	if err := mailVerify.VerifyCode(data["email"], data["code"], "changeEmail"); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	database.DB.Model(&user).Update("email", data["email"])

	return c.JSON(user)
}

func ChangeUsername(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	user, err := middleware.IsAuthenticated(cookie)

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "bad request",
		})
	}

	if data["newUsername"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill in all fields",
		})
	}

	database.DB.Model(&user).Update("username", data["newUsername"])

	return c.JSON(user)
}
