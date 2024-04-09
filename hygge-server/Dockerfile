FROM node:18

# Sets the working directory inside the container to /hygge-server.
#This is where the application code will be copied and where the container will run from.
WORKDIR /hygge-server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]