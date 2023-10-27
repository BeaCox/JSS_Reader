package mailVerify

// 邮件验证码
import (
	"JSS_Reader/database"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"
)

type MailOptions struct {
	MailHost string
	MailPort int
	MailUser string
	MailPass string
	MailTo   string
	Subject  string
	Body     string
}

var prefix map[string]string = map[string]string{
	"register":       "You are registering JSS_Reader account with the verification code: ",
	"cancel":         "You are canceling JSS_Reader account with the verification code: ",
	"forgetPassword": "You are resetting JSS_Reader password with the verification code: ",
	"changePassword": "You are changing JSS_Reader password with the verification code: ",
	"changeEmail":    "You are changing JSS_Reader email with the verification code: ",
}

// return a random code with n digits
func genRandomCode(n int) string {
	var code string

	for i := 0; i < n; i++ {
		r := rand.Intn(10)
		code += fmt.Sprintf("%d", r)
	}

	return code
}

func MailSend(o *MailOptions) error {

	m := gomail.NewMessage()

	m.SetHeader("From", o.MailUser)

	mailArrTo := strings.Split(o.MailTo, ",")
	m.SetHeader("To", mailArrTo...)

	m.SetHeader("Subject", o.Subject)

	m.SetBody("text/html", o.Body)

	d := gomail.NewDialer(o.MailHost, o.MailPort, o.MailUser, o.MailPass)

	return d.DialAndSend(m)
}

func GenCodeKey(mailAddr, from string) string {
	// from: register, cancel, forgetPassword, changePassword, changeEmail
	// so that we can distinguish different code in case of misusing
	return "MAIL-CODE-" + from + "-" + mailAddr
}

func SendCode(to string, from string) error {
	ttl := 60 * 5 // expire in 5 minutes
	key := GenCodeKey(to, from)
	// if code exists, user should wait for the code to expire
	code := genRandomCode(6)
	success, err := database.RedisDb.SetNX(database.Ctx, key, code, time.Duration(ttl)*time.Second).Result()
	if err != nil {
		fmt.Printf("SendCode redis fail %v\n", err)
		return err
	}

	if !success {
		return fiber.NewError(fiber.StatusTooManyRequests, "Verification code has been sent. Please try again later.")
	}

	if err := godotenv.Load(); err != nil {
		panic("could not load env variables")
	}

	mailHost := os.Getenv("MAIL_HOST")
	mailPort, err := strconv.Atoi(os.Getenv("MAIL_PORT"))
	if err != nil {
		panic("MAIL_PORT must be int")
	}
	mailUser := os.Getenv("MAIL_USER")
	mailPass := os.Getenv("MAIL_PASS")

	// send mail
	options := &MailOptions{
		MailHost: mailHost,
		MailPort: mailPort,
		MailUser: mailUser,
		MailPass: mailPass,
		MailTo:   to,
		Subject:  "JSS_Reader Verification Code",
		Body:     prefix[from] + "\n" + "<b>" + code + "</b>" + "\n" + "This code will expire in 5 minutes.",
	}

	err = MailSend(options)
	if err != nil {
		return err
	}
	return nil
}

func VerifyCode(mailAddr, code, from string) error {
	key := GenCodeKey(mailAddr, from)

	mailCode, err := database.RedisDb.Get(database.Ctx, key).Result()
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "The verification code is wrong or has expired.")
	}

	if mailCode != code {
		return fiber.NewError(fiber.StatusNotFound, "The verification code is wrong or has expired.")
	}

	// delete the code after verification
	err = database.RedisDb.Del(database.Ctx, key).Err()
	if err != nil {
		fmt.Printf("redis del fail %v\n", err)
		return err
	}

	return nil
}
