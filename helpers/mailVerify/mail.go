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
	MailUser string // 发件人
	MailPass string // 发件人密码
	MailTo   string // 收件人 多个用,分割
	Subject  string // 邮件主题
	Body     string // 邮件内容
}

// 返回随机的n位 code
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

	//设置发件人
	m.SetHeader("From", o.MailUser)

	//设置发送给多个用户
	mailArrTo := strings.Split(o.MailTo, ",")
	m.SetHeader("To", mailArrTo...)

	//设置邮件主题
	m.SetHeader("Subject", o.Subject)

	//设置邮件正文
	m.SetBody("text/html", o.Body)

	d := gomail.NewDialer(o.MailHost, o.MailPort, o.MailUser, o.MailPass)

	return d.DialAndSend(m)
}

func GenCodeKey(mailAddr, from string) string {
	// from: 标记是哪个业务申请的验证码
	return "MAIL-CODE-" + from + "-" + mailAddr
}

func SendCode(to string, from string) error {
	ttl := 60 * 5 // 5分钟过期
	// 先插入redis，再发邮件
	key := GenCodeKey(to, from)
	// 如果code没有过期，是不允许再发送的
	code := genRandomCode(6)
	success, err := database.RedisDb.SetNX(database.Ctx, key, code, time.Duration(ttl)*time.Second).Result()
	if err != nil {
		fmt.Printf("SendCode redis fail %v\n", err)
		return err
	}

	if !success {
		return fiber.NewError(fiber.StatusTooManyRequests, "验证码已发送，请稍后再试")
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

	// 发邮件
	options := &MailOptions{
		MailHost: mailHost,
		MailPort: mailPort,
		MailUser: mailUser,
		MailPass: mailPass,
		MailTo:   to,
		Subject:  "来自JSS_Reader的验证码",
		Body:     "您的验证码为：" + code + "，5分钟内有效。",
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
		return fiber.NewError(fiber.StatusNotFound, "验证码错误或已过期")
	}

	// 对比后马上删除
	err = database.RedisDb.Del(database.Ctx, key).Err()
	if err != nil {
		fmt.Printf("redis del fail %v\n", err)
		return err
	}

	if mailCode != code {
		return fiber.NewError(fiber.StatusNotFound, "验证码错误或已过期")
	}

	return nil
}
