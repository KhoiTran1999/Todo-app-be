FROM node:18

WORKDIR /todo-app-be

COPY package*.json ./

RUN npm install
RUN npm install sequelize-cli

COPY . .

EXPOSE 80

CMD ["npm", "run", "start-prod"]