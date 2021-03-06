var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users.controller.js')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
// Register User
router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.get('/getAllUsers', usersController.getAllUsers);
router.delete('/delete/:id', usersController.deleteUser);
router.get('/findByEmail/:email', usersController.findByEmail);
router.get('/findById/:id', usersController.findById);
router.post('/update', usersController.update);
router.post('/profile/editPhoto', multipartMiddleware, usersController.editPhoto);
router.patch('/addRelationship', usersController.addRelationship);
router.post('/removeRelationship', usersController.removeRelationship);






module.exports = router;
