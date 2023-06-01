// const cors_proxy = require('cors-anywhere');

// let port = process.env.PORT || 8080;

// cors_proxy.createServer({
//   originWhitelist: [], // Allow all origins
//   requireHeader: ['origin', 'x-requested-with'],
//   removeHeaders: ['cookie', 'cookie2']
// }).listen(port, function () {
//   console.log('Running CORS Anywhere on localhost:' + port);
// });

// cors_proxy.createServer({
//   originWhitelist: [], // Allow all origins
//   requireHeader: ['origin', 'x-requested-with'],
//   removeHeaders: ['cookie', 'cookie2'],
//   timeout: 300000 // Increase timeout to 5 minutes
// }).listen(port + 1, function () {
//   console.log('Running CORS Anywhere on localhost:' + (port + 1));
// });


const express = require('express');
const path = require("path");
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// app.use(express.static(path.join(__dirname, "/../public")));
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// dbConnect(global.env.DB_URL);
// seedUser();
// seedMembership();
app.use('/api/v1', apiRoutes);

app.all('*', function (req, res) {
  res.sendFile(path.join(__dirname, "/../public/index.html"));
});

module.exports = app;