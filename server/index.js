require('dotenv').config();
const express = require('express');
// Only need one port variable if you want them on the same port
const port = process.env.PORT || 8000; 

const cookieparser = require('cookie-parser');
var cors = require('cors');
// const bodyParser = require('body-parser'); // <--- REMOVED: Replaced by express built-in

const app = express();
const path = require('path');
const connectDB = require('./config/mongoose');

// Corrected middleware configuration
app.use(cors());
app.use(express.json());
// FIX 1: Add { extended: true } to suppress deprecation warning
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser()); // this both middleware is needed to run before router

// socket setup
const server = require('http').createServer(app);
const chatSockets = require('./config/chat_sockets').chatSockets(server);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Static assets
app.use(express.static('static'));

// Router
app.use('/', require('./routes/index_route'));


// Start the app only after the DB connection is established
(async function bootstrap() {
    try {
        // NOTE: You still need to fix the Mongoose 'strictQuery' warning 
        // inside your ./config/mongoose.js file.
        await connectDB();

        // Start the socket server (using the HTTP server instance)
        server.listen(port, function (err) {
            if (err) {
                console.log('Error to start socket server!!!');
                return;
            }
            console.log('Socket server is running on the port: ', port);
        });

        // The Express app itself doesn't need to listen separately 
        // since the HTTP server (server) is handling the requests for 'app'.
        // If you intended to run them on separate ports, you'd use app.listen(port) 
        // and server.listen(socketport) as you did originally.
        // I've simplified it to one listen call for the combined server.
        // If you prefer your original two-listen setup, revert this part.
        
    } catch (err) {
        console.error('Failed to start application due to DB connection error.');
        process.exit(1); // Exit with a non-zero code to indicate failure
    }
})();