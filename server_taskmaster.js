const express = require('express');
const app = express();
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

const PORT = process.env.NODE_ENV === 'production' ? 5011 : 8080;


const apiRoutes = require('./server/routes/routes')
app.use('/api/', apiRoutes )

console.log("ENV".green, process.env.NODE_ENV);

if ( process.env.NODE_ENV === 'staging' ){
    app.get('/', (req,res) => {
        console.log("request incoming");
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
} else if ( process.env.NODE_ENV === 'production' ){
    app.get('/', (req,res) => {
        console.log("request incoming");
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}


app.listen(PORT, (req, res) => {
    console.log(`App running on PORT:${PORT}`.cyan);
});
