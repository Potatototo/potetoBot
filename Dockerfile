FROM node:17.4.0

WORKDIR /app

RUN apt-get update || : && apt-get install python -y
RUN apt-get install ffmpeg -y

COPY package*.json ./

RUN npm ci

COPY . .

CMD [ "npm", "run", "start" ]