const bcrypt = require('bcryptjs');
const { uuid } = require('uuidv4');
const async = require('async');
let db = require('../models');
let user = require('../user.json');

// user account routes
const loginUser = async (req, res) => {
  try {
    console.log("Login --userController", req.body);
      user = { ...user, ...req.body };
      const query = { email: req.body.email };
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
              };
          } else {
              response = { message: 'Invalid username/password' };
          };
      } else {
          response = { message: 'Database error' };
      };
      res.json(response);
  } catch (err) {
      console.log("Error!!", err);
      res.status(500).json({
          message: "error -- internal error"
      })
  };
};

const addUser = async (req, res) => {
  console.log("addUser controller ---- ")
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
  } catch (err) {
      res.json(console.log("Error --addUser", err ));
  }
};

const updateUserProfile = async (req, res) => {
  const response = await db.userprofile.findOneAndReplace(
    { email: req.body.email },
    req.body
  );
  res.json(response);
};

const authUser = async (req, res) => {
  const query = { email: req.params.email };
  const response = await db.userauth.find(query);
  if (response.length > 0) {
      res.json(response[0].password);
  } else res.json({ answer: 'nothing found' });
};

const getUserName = async (req, res) => {
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
};

const getUserPassword = async (req, res) => {
  const query = { email: req.params.email };
  const response = await db.userprofile.find(query, 'password');
  if (response.length > 0) {
      res.json(response);
  } else res.json({ answer: 'nothing found' });
};

//dashboard functionality routes
const getAllUsers = async (req, res) => {
    // console.log('api getAllUsers called');
    const response = await db.userprofile.find({}, 'email');
    if (response.length > 0) {
        res.json(response);
    } else res.json({ answer: 'empty set!' });
};

const insertShared = async (req, res) => {
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
};

const getUser = async (req, res) => {
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
};

const updateSharedDashboards = async (req, res) => {
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
};

module.exports = { 
// user account routes
  loginUser, 
  addUser, 
  updateUserProfile,
  authUser,
  getUserName, 
  getUserPassword,
// dashboard functionality routes
  getAllUsers,  
  insertShared, 
  getUser, 
  updateSharedDashboards 
};
