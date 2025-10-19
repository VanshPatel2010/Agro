const mongoose = require('mongoose');

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error into coonect to the database'));

db.once('open',function()
{
    console.log("/////Database is connected sucessfully/////");
});


// Prefer setting the connection URI via environment variable.
// If MONGO_URI is not set, fall back to a local mongodb instance.
// Do NOT commit production credentials to source control.
const MONGO_URI = process.env.MONGO_URI || '';

/**
 * Connects to MongoDB using mongoose.
 * Throws on connection failure so callers can handle process exit/retry logic.
 */
async function connectDB() {
    try {
        // Mongoose 6+ handles parsing options by default, but providing compatibility options is safe.
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = mongoose.connection;

        db.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        db.once('open', () => {
            console.log('Database connected successfully');
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
    }
}

module.exports = connectDB;




// const connectDB = async () => {
//     await mongoose.connect(URI, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true
//     });
//     console.log('db connected..!');
//   };
  
//   module.exports = connectDB;
  




