FROM node:18.18.0

WORKDIR '/app'

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

# serve
RUN npm install -g serve


CMD ["serve", "-s", "build"]
