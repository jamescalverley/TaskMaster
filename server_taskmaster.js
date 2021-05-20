// require('dotenv').config();
const express = require('express');
const async = require('async');
const colors = require('colors');

//* disables mailjet
// const mailjet = require('node-mailjet').connect(
//     '9bbf027ee6279e41c94fe9415814fe62',
//     'e7ad8b61eb1ba86f544198bb47a52f0d'
// );

const axios = require('axios');
const app = express();
const http = require('http').createServer(app);
var io = require('socket.io')(http);
const qs = require('qs');
const { uuid } = require('uuidv4');
//const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
// import { v4 as uuidv4 } from 'uuid';
let db = require('./server/models');
let user = require('./server/user.json');
// let usersSockets = new Map();
// let userRooms = new Map();
// let sharedDashboard = require('./shared.json');

// const db_host = process.env.DB_HOST;


async function getUsers() {
    const result = await db.find({}, { email: 1 });
    // console.log('function getUsers called', result);
}

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

// getUsers();
//route to get all users
app.get('/api/getAllUsers', async (req, res) => {
    // console.log('api getAllUsers called');
    const response = await db.userprofile.find({}, 'email');
    if (response.length > 0) {
        res.json(response);
    } else res.json({ answer: 'empty set!' });
});
app.post('/api/insertShared', async (req, res) => {
    // console.log('insertShared api called', req.body);
    let sharedDashboard = {
        sharedFrom: req.body.sharedFrom,
        sharedTo: req.body.sharedTo,
        sharedDashboards: req.body.dashboards.toString(),
    };
    // console.log(sharedDashboard);
    const filter = {
        sharedFrom: req.body.sharedFrom,
        sharedTo: req.body.sharedTo,
    };
    // console.log('filter:', filter);
    const result = await db.shared
        .findOneAndReplace(filter, sharedDashboard, {
            upsert: true,
            returnNewDocument: true,
        })
        .then((response) => response);
    // console.log(result);
    res.json(result);
});
app.get('/api/getUser/:email', async (req, res) => {
    // console.log('getUser called for email:', req.params);
    const query = { email: req.params.email };
    const response = await db.userprofile.find(query);
    const sharedDashboardsTo = await db.userprofile.find(
        {
            'sharedByUser.to': req.params.email,
        },
        {
            _id: 0,
            email: 1,
            'sharedByUser.$': 1,
            dashboards: 1,
            firstname: 1,
            lastname: 1,
        }
    );
    // const sharedDashboardsFrom = await db.shared.find({
    //     sharedFrom: req.params.email,
    // });
    let reply = [];
    reply.push(response);
    reply.push(sharedDashboardsTo);
    // reply.push(sharedDashboardsFrom);
    // console.log(reply);

    if (response.length > 0) {
        res.json(reply);
    } else res.json({ answer: 'nothing found' });
    // res.end('ok');
});

app.get('/api/getUserName/:email', async (req, res) => {
    const query = { email: req.params.email };
    const response = await db.userprofile.find(query, {
        _id: 0,
        name: 1,
        firstname: 1,
        lastname: 1,
        email: 1,
    });
    if (response.length > 0) {
        res.json(response[0]);
    } else {
        res.json({ answer: 'nothing found' });
    }
});

app.get('/api/authUser/:email', async (req, res) => {
    // console.log(req.params);
    const query = { email: req.params.email };
    const response = await db.userauth.find(query);
    if (response.length > 0) {
        res.json(response[0].password);
    } else res.json({ answer: 'nothing found' });
    // res.end('ok');
});

app.get('/api/getUserPassword/:email', async (req, res) => {
    // console.log(req.params);
    const query = { email: req.params.email };
    const response = await db.userprofile.find(query, 'password');
    if (response.length > 0) {
        res.json(response);
    } else res.json({ answer: 'nothing found' });
    // res.end('ok');
});

app.post('/api/addUser', async (req, res) => {
    // console.log(req.body);
    user = { ...user, ...req.body };
    user.dashboards[0].owner = req.body.email;
    user.dashboards[0].id = uuid();
    user.dashboards[0].columns[0].id = uuid();
    user.dashboards[0].columns[0].cards[0].id = uuid();
    let passwordHash = '';
    const saltRounds = 10;
    passwordHash = await bcrypt.hash( 
        req.body.password, 
        saltRounds, 
        null, 
        (err,hash) => {if(err){console.log("Error --addUser", err)}}
    );
    console.log(`--[addUser]-- (hash=${passwordHash}) req.body:`, user);
    user.password = passwordHash;

    try {
        const response = await db.userprofile.create(user);
        res.json(response);
    } catch (error) {
        res.json(error);
    }
});

app.post('/api/login', async (req, res) => {
    try {
        console.log("Login", req.body);
        user = { ...user, ...req.body };
        const query = { email: req.body.email };
            //const userProfile = await db.userprofile.findOne(query);
            let userProfile = await db.userprofile.find(query, {
            _id: 0,
            email: 1,
            password: 1,
            });
        console.log("user:", userProfile);
        let response;
        if (userProfile) {
            userProfile = JSON.stringify(userProfile);
            userProfile = JSON.parse(userProfile);
            console.log(req.body.password);
            if (userProfile[0]) {
                console.log("Password:", userProfile[0].password);
                const isValidPassword = await bcrypt.compare(
                    req.body.password,
                    userProfile[0].password
                );
                if (isValidPassword) {
                    response = {
                        message: 'OK',
                        email: userProfile[0].email,
                    };
                } else {
                    response = { message: 'Invalid username/password' };
                }
            } else {
                response = { message: 'Invalid username/password' };
            }
        } else {
            response = { message: 'Database error' };
        }
        res.json(response);

    } catch (err) {
        console.log("Error!!", err);
        res.status(500).json({
            message: "error -- internal error"
        })
    }
    
});

app.post('/api/notify', async (req, res) => {
    console.log(req.body);
    // user = { ...user, ...req.body };
    // const response = await db.userprofile.create(user);
    // const url = 'https://rudzki.ca/wyslijmail.php';
    // const options = {
    //     method: 'post',
    //     url: 'https://rudzki.ca/wyslijmail.php',
    //     data: qs.stringify(req.body),
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    //     },
    // };
    // const response = await axios(options).then((answer) => {
    //     console.log(answer.status);

    //     return answer.data;
    // });
    // console.log(response);

    //* disables mailjet
    // const request = mailjet.post('send', { version: 'v3.1' }).request({
    //     Messages: [
    //         {
    //             From: {
    //                 Email: 'taskmaster.notification@gmail.com',
    //                 Name: 'TaskMaster',
    //             },
    //             To: [
    //                 {
    //                     Email: 'startanant@gmail.com',
    //                     Name: 'Anant',
    //                 },
    //                 { Email: 'james.calverley3@gmail.com', Name: 'James' },
    //                 { Email: 'przemek.rudzki@gmail.com', Name: 'Przemek' },
    //             ],
    //             TemplateID: 1353168,
    //             TemplateLanguage: true,
    //             Subject: 'Invitation to collaborate',
    //         },
    //     ],
    // });
    // request
    //     .then((result) => {
    //         // console.log(result.body);
    //     })
    //     .catch((err) => {
    //         // console.log(err.statusCode);
    //     });

    // res.json({
    //     answer: 'ok',
    // });
    //* ___________
});
app.post('/api/updateUserProfile', async (req, res) => {
    // console.log(req.body);
    // user = { ...user, ...req.body };
    const response = await db.userprofile.findOneAndReplace(
        { email: req.body.email },
        req.body
    );
    res.json(response);
});
// app.get('/login', (req, res) => {
//     const options = {
//         root: path.join(__dirname, 'public'),
//     };
//     res.sendFile('index.html', options);
// });

// app.get('/projectdashboard', (req, res) => {
//     const options = {
//         root: path.join(__dirname, 'public'),
//     };
//     res.sendFile('index.html', options);
// });

// app.get('/mytasks', (req, res) => {
//     console.log(req.url)
//     const options = {
//         root: path.join(__dirname, 'public'),
//     };
//     res.sendFile('index.html', options);
// });

// app.get('/register', (req, res) => {
//     const options = {
//         root: path.join(__dirname, 'public'),
//     };
//     res.sendFile('index.html', options);
// });

app.put('/api/updateSharedDashboards', async (req, res) => {
    console.log('loggin content for updating shared dashboards', req.body);

    let queries = [];
    req.body.forEach((el) => {
        let search = { 'dashboards.id': el.id };
        let query = { $set: { 'dashboards.$': el } };
        queries.push([search, query]);
    });
    async function sendQuery(param) {
        console.log('async sendQuery called:', param);
        await db.userprofile.update(param[0], param[1]);
    }
    console.log('logging queries array:', queries);
    async.map(queries, sendQuery, function (err, result) {
        res.json('ok');
    });
});


//* disables socket.io
// io.on('connect', (socket) => {
//     socket.on('disconnect', () => {
//         console.log('a user disconnected', socket.id);
//         usersSockets.forEach((value, key) => {
//             if (value == socket.id) {
//                 // console.log('FOUND!');
//                 usersSockets.delete(key);
//             }
//         });
//         userRooms.delete(socket.id);
//         // console.log(usersSockets);
//     });
//     console.log('a user connected', socket.id, socket.handshake.query.dash);
//     if (socket.handshake.query.user) {
//         usersSockets.set(socket.handshake.query.user, socket.id);
//     }
//     // if (
//     //     socket.handshake.query.chatuser &&
//     //     socket.handshake.query.chatuser.indexOf('@') > -1 &&
//     //     socket.handshake.query.dash.length > 0
//     // ) {
//     //     usersSockets.set(socket.handshake.query.chatuser, socket.id);
//     //     let user = socket.handshake.query.chatuser;
//     //     let room = socket.handshake.query.dash;
//     //     socket.join('abc', (err) => {
//     //         if (err) {
//     //             console.log('error');
//     //         }
//     //         console.log(user + ' joined room:' + room);
//     //     });
//     // }
//     socket.on('chatopen', (user, dash) => {
//         console.log('user joining chat room', user, dash);
//         socket.join(dash);
//         io.to(dash).emit('chat', `${user} joined`);
//         userRooms.set(socket.id, dash);
//         console.log(userRooms);
//     });
//     socket.on('chatchange', (user, dash) => {
//         console.log('user leaving dashboard room', user, dash);
//         io.to(dash).emit('chat', `${user} left room`);
//         socket.leave(dash, (err) => {
//             userRooms.delete(socket.id);
//             if (err) console.log('ERROR LEAVING ROOM');
//         });
//     });
//     socket.on('chat', (user, msg, dash) => {
//         // socket.join(dash);
//         console.log(`received chat message from ${user}`, msg, dash);
//         let room = dash;
//         console.log('room is: ', room);
//         io.to(dash).emit('chat', user, msg);
//     });
//     socket.on('update', (msg) => {
//         // console.log('update:', msg, socket.id);
//         const obj = JSON.parse(msg);
//         obj.shared.forEach((el) => {
//             if (usersSockets.has(el.to)) {
//                 // console.log('can emit!');
//                 socket.broadcast
//                     .to(usersSockets.get(el.to))
//                     .emit('update', 'update coming!');
//             }
//         });

//         // socket.emit('update', `user updated:${msg.user}`);
//     });
//     socket.on('username', (msg) => {
//         console.log('username:', msg, socket.id);
//     });
//     socket.on('updateother', (msg) => {
//         console.log('update other triggered', msg, socket.id);
//         const obj = JSON.parse(msg);
//         obj.sharedOther.forEach((el) => {
//             if (usersSockets.has(el)) {
//                 console.log('found it! can emit update shered!');
//                 socket.broadcast
//                     .to(usersSockets.get(el))
//                     .emit('update', 'update coming!');
//             }
//         });
//     });

//     // console.log(usersSockets);
// });
//* __________________

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

const PORT = process.env.NODE_ENV === 'production' ? 5011 : 8080;
http.listen(PORT, (req, res) => {
    console.log(`App running on PORT:${PORT}`.cyan);
});
