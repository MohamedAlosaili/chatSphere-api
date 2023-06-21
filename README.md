# [ChatSphere 💬](https://chat-sphere-phi.vercel.app/)

## Description

This repository contains the backend API server for [ChatSphere](https://github.com/MohamedAlosaili/chatSphere) application.
For more detailed information about the project, including frontend setup,
please refer to the main repository [here](https://github.com/MohamedAlosaili/chatSphere).

## Server Stack

- [Nodejs](https://nodejs.org)([Expressjs](https://expressjs.com/))

- [Socket.io](https://socket.io/)

- [MongoDB](http://mongodb.com/)([Mongoose](https://mongoosejs.com/))

- [Firebase/storage](https://console.firebase.google.com)

- [nodemailer](https://nodemailer.com/)

- [Json Web Token](https://www.npmjs.com/package/jsonwebtoken)

## Run Server Locally

- First, you should have [nodejs](https://nodejs.org), and npm installed

- Second, add the `.env` file in the root directory with these variables

```bash
NODE_ENV=development
PORT=5000

DEV_CLIENT_URL=http://localhost:3000
PROD_CLIENT_URL=

# Get a MongoDB URI from https://cloud.mongodb.com
MONGODB_URI=

EMAIL=
# if you use Gmail you should use the Gmail App Passwords https://myaccount.google.com/apppasswords not the original password
EMAIL_PASSWORD=


# A random string. should match with JWT_SECRET in the fontend
JWT_SECRET=
JWT_EXPIRE=30d

# Firebase config
APIKEY=
AUTHDOMAIN=
PROJECTID=
STORAGEBUCKET=
MESSAGINGSENDERID=
APPID=

MAX_PHOTO_SIZE=1048576
MAX_FILE_SIZE=10485760
MAX_IMAGE_SIZE=10485760
MAX_VIDEO_SIZE=52428800
```

- Last step, install the dependencies and run the development server:

```bash
npm install && npm run dev
# or
yarn install && yarn dev
# or
pnpm install && pnpm dev
```

- To populate the DB with sample data run the below script

```bash
npx ts-node src/seeder i
# or
yarn ts-node src/seeder i
# or
pnpm ts-node src/seeder i
```
