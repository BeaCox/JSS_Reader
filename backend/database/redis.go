package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
)

var (
	Ctx     = context.Background()
	RedisDb *redis.Client
)

func RedisInit() {
	if err := godotenv.Load("../.env"); err != nil {
		panic("could not load env variables")
	}

	redisAddr := os.Getenv("REDIS_ADDR")
	password := os.Getenv("REDIS_PASSWORD")
	db, err := strconv.Atoi(os.Getenv("REDIS_DB"))

	RedisDb = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: password,
		DB:       db,
	})

	pong, err := RedisDb.Ping(Ctx).Result()
	if err != nil {
		panic(fmt.Sprintf("connect redis fail: %v", err))
	} else {
		log.Println("redis connect success: ", pong)
	}

}
