# JSS_Reader

**A reader for SJTU Simple Syndication. **

## Front-end 

### Environment

This project is built using React and relies on the following main dependencies:

- Node.js:`18.18.0`
- React: `18.2.0` 
- Create-react-app:`5.0.1`
- Antd: `5.9.4`
- Axios: `1.5.1`

### Usage

### use npm

You can install project dependencies using the following command:

```
npm install
```

You can run the project locally using the following command:

```
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.



### Todo

####  **Landing Page**

- [x] Feature blocks animation appearing one by one 10.2x
- [x] Display details on mouse hover over feature blocks 10.2x
- [x] Button in bottom right to quickly return to the top 10.2x
- [x] Beautify the registration and login pages 10.28
- [ ] Replacing text and images in the property display section

#### Content

- [x] **Categories and subscriptions lists** 10.2x
- [x] Rss detail Modal 10.2x
- [x] Newfeed 10.28
- [x] **Three views for RSS articles** 10.28
- [x] **Fetching articles** 10.28
- [x] Display content following HTML syntax 10.28
- [x] **Explore page** 10.29
- [x] **Updates when a new subscription is added** 10.30
- [x] Solve the tag confusion problem 10.30
- [x] **Solve the bug of not rendering 'unread' icon in time after one-click reading** 10.30
- [x] Solve the new feed render order problem 10.30
- [x] Add a loading component before successfully rendering the article 10.31
- [x] Modify the style 10.31
- [ ] Render 'star' and 'unread' icons anytime property changed
- [ ] Change the Logo ?
- [ ] Adapts to different sizes of devices

#### Account

- [x] Delete account 10.28
- [x] Test and modify reset password and email10.29
- [x] Modify username 10.29

#### **Settings**

- [x] General
  - [x] Default sort - latest/oldest 10.30
  - [x] Default presentation - cards/magazine/titles view 10.30
  - [x] Mark as read on scroll - yes/no 10.30
- [x] Appearance
  - [x] Fontsize 10.30
  - [x] Fontfamily 10.30
  - [x] Theme (add system preference) 10.30
  - [x] Display density 10.30
- [x] **Settings test and imporove** 10.31

## Back-end

### Environment

This project is built using Go fiber and relies on the following main dependencies:

+ golang:`1.21`

+ mysql:`5.7`

+ redis:`6.2.6`

### Usage

You can install project dependencies using the following command:

```bash
go mod tidy
```

create `.env`:

```
SECRET_KEY=Your_secret_key_for_jwt
DB_USER=Your_db_user
DB_PASSWORD=Your_db_password
DB_HOST=mysql
DB_NAME=Your_db_name
MAIL_HOST=Your_mail_host
MAIL_PORT=Your_mail_port
MAIL_USER=Your_mail_user
MAIL_PASS=Your_mail_pass
REDIS_ADDR=redis:6379
REDIS_PASSWORD=Your_redis_password
REDIS_DB=0
REMOTE_BACKEND_URL=http://localhost:8000
REMOTE_FRONTEND_URL=http://localhost:3000
```

You can run the project locally using the following command:

```bash
go run main.go
```

## Quick Start

create `.env` file:

```
SECRET_KEY=Your_secret_key_for_jwt
DB_USER=Your_db_user
DB_PASSWORD=Your_db_password
DB_HOST=mysql
DB_NAME=Your_db_name
MAIL_HOST=Your_mail_host
MAIL_PORT=Your_mail_port
MAIL_USER=Your_mail_user
MAIL_PASS=Your_mail_pass
REDIS_ADDR=redis:6379
REDIS_PASSWORD=Your_redis_password
REDIS_DB=0
REMOTE_BACKEND_URL=Your_backend_url_without_slash_at_end
REMOTE_FRONTEND_URL=Your_front_end_url_without_slash_at_end
```

copy it to the project root directory and `backend` directory

build jss_reader-react image:

```bash
cd frontend
docker build -t jss_reader-react:1.1.0 .
```

build jss_reader-go image:

```bash
cd backend
docker build -t jss_reader-go:1.1.0 .
```

run using docker compose file:

```bash
docker compose up
```

## Authors

[@BeaCox](https://beacox.space)

[@wytili](https://github.com/wytili)

[@Sora-Yanl](https://github.com/Sora-Yanl)

[@G-AOi](https://github.com/G-AOi)

