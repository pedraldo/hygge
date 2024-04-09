# Hygge

A simple web app allowing users to take and share instantly pictures related to personal events.

## Installation

### Production ready (WIP)

🚧🚧🚧

### Development

#### Containers

--> Clone the project.  
--> Go to the project root directory : `cd hygge`  
--> Launch the docker compose dev file to create a container for the PostgreSQL database an a container for Minio (you need to have Docker installed on your computer) :

```
docker-compose -f docker-compose_dev.yml up -d
```

You can verify that both containers are running (with `docker ps`) :

- minio_server_hygge_dev_container
- postgres_hygge_dev_container

#### Server

--> Go to hygge server directory : `cd hygge-server`  
--> Install dependencies : `npm i`  
--> Configure environment variables. To do so, rename root file `.env.sample` to `.env.dev`  
--> Run database initialisation script : `npm run init:db`  
This script configures the database schema (tables) and seeds it with some data  
--> Start server : `npm start`

#### Front

--> Go to hygge app directory : `cd ../hygge-app` (from hygge-server)  
--> Install dependencies : `npm i`  
--> Start app : `npm start`

Application is now available at http://localhost:4200/

If you want to test the app with a mobile device, instead of starting the app with `npm start` command, use `npm run start:host`.  
Your terminal will display the your local IP address with 4200 port that you have to enter in your mobile device browser.

⚠️ With a mobile device, you will be able to take pictures but not to visualize them (same for pictures from other users / devices).
On local mode, object (pictures) signed urls provided by Minio are not accessible from outside your local machine.

## Usage

Enter your credentials (email and password) in the login page or go to register page to create an account, then log in.
You can use two accounts created by the seeding script :

```
email: super@programer.com ;   password: superprogramer
email: plants@friend.com   ;   password: plantsfriend
```

Some events are connected to thoose accounts.

On the events page, you can create an event by clicking the top right button "+".
Enter informations about the event. You can invite other users in the creation form or after creation (on the event page).

If you want to take a picture linked to the event, you will have to set the target event. To do so, click on the button on the very top right corner of the app (in the header) where you will have the possibility to choose which event you want to link the pictures you will take.

Finally, to take a picture, click on the middle bottom white button with the camera icon. You will have the possibility to import a picture from your device, or take a picture with your device if you use a mobile device (phone / tablet).
Find the picture you imported / took in the targeted event gallery.

## Stack

- Front : Angular 17, Ng-Zorro

- Back : NestJS, Prisma (ORM)

- BDD : PostgreSQL
- Object storage : Minio

## Features

### Authentication

- ✅ Register

- ✅ Log in
- ✅ Log out

- ✅ JWT access token
- ✅ Auth guards / redirection

### Events

- ✅ List authenticated user related events
- ✅ Display event's informations :
  - Name, start/end date, description
  - List of invitees
  - Gallery : event pictures shared
- ✅ Add, remove invitees

## Roadmap

### Authentication

- [ ] Refresh token
- [ ] Email validation
- [ ] Parent route (and template) for login / register

### Events

- [ ] Update / delete an event
- [ ] Filter / order (creation date, start date, ...) events list
- [ ] Handle cover picture load fail (fallback)
- [ ] Refresh button on event pictures gallery
- [ ] Display picture creator name in gallery lightbox
- [ ] Filter gallery picture by creator (user)
- [ ] Delete picture

### Globally

- [ ] Add / improve errors handling
- [ ] Display explicit messages to user to inform success or failure when data manipulation
- [ ] Display spinners / loaders when data are loading

### Deploy

- [ ] Build a docker-compose to launch all the app locally with one command
- [ ] Deploy app on web
  - [ ] Search tools for simple monitoring, errors tracking ...
