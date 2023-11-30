const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authController = require('../controllers/auth');

router.post('/setadmin', authController.requireLogin,userController.isAdmin,userController.setAdmin);
router.get('/list', 
// authController.requireLogin,
userController.list);
router.get('/getu/:userID', 
authController.requireLogin,
userController.userByID);

router.post('/signup',userController.create);
router.delete('/delete/:userID',
authController.requireLogin,
userController.hasAuthorization,
userController.remove);


//login
router.get('/login', authController.view);
router.post('/login', authController.signIn);

module.exports = router;

