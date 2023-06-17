const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const dotenv = require('dotenv')
const compression = require('compression')
const secureEnv = require('secure-env')
const path = require('path')
const { Server } = require('socket.io')

const route = require('./routes/routes.js')
const { dbConnect, seedPrompts } = require("./db/config")

const { cronJob } = require('./controllers/cronJobController.js')

global.env = secureEnv({ secret: '9cW7@0LY%0F0R@KOj5cL90yv' });

const server = http.createServer(app)

const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
};
app.use(compression({
    filter: shouldCompress,
    threshold: 512
}));

dotenv.config()

app.use((express.json({ limit: "30mb", extended: true })))
app.use((express.urlencoded({ limit: "30mb", extended: true })))
app.use((cors()))
app.use(express.static(path.join(__dirname, 'public')))
app.enable('trust proxy')

// create an io server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log(`User connnected ${socket.id}`)
})

dbConnect();
seedPrompts()

// User Routes
app.use('/', route)

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

const PORT = global.env.PORT
console.log("SERVER PORT : " + PORT);

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
    cronJob({ io })
});
