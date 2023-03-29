FROM node:19.8.1-alpine

WORKDIR /app

# RUN apt-get update || : && apt-get install python ffmpeg -y
RUN apk add --update git python3 ffmpeg

COPY package*.json ./

# RUN npm ci
RUN yarn install

COPY . .

CMD [ "npm", "run", "start" ]