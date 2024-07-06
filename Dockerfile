FROM  node:slim
RUN  mkdir -p /home/youtube/app
WORKDIR /home/youtube/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
