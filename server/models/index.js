const mongoose = require('mongoose');
require('dotenv').config();

const db_uri = process.env.DB_URI || '';
console.log("MongoDB connected".cyan);
mongoose.connect(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;
const userProfileSchema = new mongoose.Schema(
    {},
    { collection: 'userprofile', strict: false }
);
const userAuthSchema = new mongoose.Schema(
    {},
    { collection: 'userauth', strict: false }
);
const sharedSchema = new mongoose.Schema(
    { sharedFrom: String, sharedTo: String, sharedDashboards: Array },
    { collection: 'shared' }
);
db.userprofile = mongoose.model('userprofile', userProfileSchema);
db.userauth = mongoose.model('userauth', userAuthSchema);
db.shared = mongoose.model('shared', sharedSchema);

module.exports = db;
