const express = require('express');
const router = express.Router();

const { 
  loginUser, 
  addUser, 
  updateUserProfile,
  authUser, 
  getUserName,
  getUserPassword, 
  getAllUsers, 
  insertShared, 
  getUser, 
  updateSharedDashboards
} = require('../controllers/allControllers');

// user account routes
router
  .route('/login')
  .post( loginUser )

router 
  .route('/addUser')
  .post( addUser )

router 
  .route('/updateUserProfile')
  .post( updateUserProfile )

router
  .route('/authUser/:email')
  .get( authUser )

router 
  .route('/getUserName/:email')
  .get( getUserName )

router
  .route('/getUserPassword/:email')
  .get( getUserPassword )

// dashboard functionality routes
router  
  .route('/getAllUsers')
  .get( getAllUsers )

router
  .route('/insertShared')
  .post( insertShared )

router
  .route('/getUser/:email')
  .post( getUser )

router
  .route('/updateSharedDashboards')
  .put( updateSharedDashboards )

module.exports = router;