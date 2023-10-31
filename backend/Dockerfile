FROM golang:1.21

ENV GOPROXY https://goproxy.cn

WORKDIR /go/src/app

COPY . .

RUN go mod tidy

RUN go build -o /go/bin/app

CMD ["/go/bin/app"]