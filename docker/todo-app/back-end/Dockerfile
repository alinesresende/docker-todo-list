FROM node:16-alpine

WORKDIR /app/back-end

EXPOSE 3001

ADD /node_modules.tar.gz ./

COPY . .

RUN npm install

ENTRYPOINT [ "npm" ]

CMD [ "start" ]
