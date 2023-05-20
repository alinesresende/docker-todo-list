FROM betrybe/puppetter:1.0

WORKDIR /app/tests

ADD /node_modules.tar.gz ./

COPY . .

RUN npm install

ENTRYPOINT [ "npm" ]

CMD [ "test" ]
