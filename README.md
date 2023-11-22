# Trade Tracker Backend

Backend for a trade tracker application. Currently built to work with TradeZero, but can be extended to work with other brokers. Analyse and track your trades with this application, giving you the ability to see your performance over time, and to see what you are doing right and wrong. 

Currently the application is set to work with postgresql, but can be extended to work with other databases.

Designed to accept a csv file from TradeZero in order to populate the database with trades. The csv file can be uploaded using the API for testing.

The app is currently deployed to Railway.app and is set up to work as such. The older version of the app was designed to run on my localhost, which is what most of the documentation below is based on. See the demo section below for more information.

## Frontend Example

I built a frontend for this application using React. You can find the code for it here:

- **Trade Tracker Frontend**: [Explore Frontend Repository](https://github.com/Jas667/trade_tracker_frontend)

## Demo

- **Live Application:** [Trade Tracker on Railway](https://tradetrackerfrontend-production.up.railway.app/)
- **Test Account:**
  - Username: `TestUser`
  - Password: `adminadmin`

## Getting Started

The instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

Install dependencies on your local machine using npm:

```
npm install
```

Currently the application is set to worth with postgresql. You will need to create a database and a user with access to that database. The config.json file is currently set with the following values:

```
  "development":
    "username": "postgres",
    "password": "postgres",
    "database": "trade_tracker",
    "host": "127.0.0.1"
    "dialect": "postgres"
```
NOTE: Change the values to match your database and user. Do not commit your config.json file to github if you change the values.

Once you have created your database and user, you will need to run the migrations to create the tables in your database. To do this, run the following command:

```
npm run dbmigrate
```
If you want to use the seed data to populate your database with some sample data, run the following command:

```
npm run dbseed
```

You can undo both of these by running the following commands:

```
npm run dbseedundo
npm run dbmigrateundo
```

The application is currently set to run on port 3000. You can change this in the config.json file. To run the application, simply run the following command:

```
npm start
```

## Authentication and Authorisation

In order to use most of the routes, you will need to be authenticated and authorised. If using the seed data, you can use the example information provided at the swagger Authentication/User Login route. This will provide a JWT token stored in a cookie that will be used to authenticate and authorise you for the other routes. 

You can also create your own user using the swagger user/register User route.

## Environment Variables

Currently the .env file should be set with the following variables. The values provided are only examples, and should be changed to suit your needs.

``````
TOKEN_SECRET=secret
REFRESH_TOKEN_SECRET=secret
CORS_ORIGIN=http://localhost:5173
ALLOWED_EMBED_ORIGIN=http://localhost:5173

SALT_ROUNDS=10
```

# for database
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=trade_tracker_dev
DB_HOST=127.0.0.1
DB_DIALECT=postgres
```
#for nodemailer
EMAIL_USER=your email
EMAIL_PASSWORD=your password
```

## Origin Headers in Development

The browser wasn't sending the origin header when running the application in development. To get around this, I used the following code in the app.js file:

app.use("/userImageUploads", function (req, res, next) {
  const origin = req.get("Origin");

  //Browser isnt sending origin header due to being on same origin localhost for development. Add if statement during production
  
  // if (allowedEmbedOrigins.includes(origin)) {
    res.header("Cross-Origin-Embedder-Policy", "none");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
  // }

  next();
});

The if statement should be included during production, but I have commented it out for development purposes.

## Test the API

You can test the API using Swagger. The swagger documentation can be found at http://localhost:3000/api-docs/#/

## Built Using

 - [Node.js](https://nodejs.org/en/) - JavaScript runtime
      - [Express](https://expressjs.com/) - Web framework
      - [Sequelize](https://sequelize.org/) - ORM
      - [Swagger](https://swagger.io/) - API documentation

## Authors

  - **James Orr** -
    [Jas667](https://github.com/Jas667)

## License

This project is licensed under the ISC License - [ISC](https://opensource.org/licenses/ISC)

## Acknowledgments

  - Hat tip to anyone whose code is used. You likely got me out of a jam.
