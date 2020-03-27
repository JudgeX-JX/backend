FROM node:13-alpine
WORKDIR /app
COPY . /app
RUN npm i
EXPOSE 5000
CMD ["npm", "start"]
