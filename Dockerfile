FROM node:10.16-alpine
RUN mkdir /app && npm install knex -g
WORKDIR /app
EXPOSE 5001