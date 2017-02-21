var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users.controller.js')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
// Register User
router.post('/', usersController.register);
router.post('/login', usersController.login);
router.get('/', usersController.getAllUsers);
router.delete('/:id', usersController.deleteUser);
router.get('/findByEmail/:email', usersController.findByEmail);
router.get('/:id', usersController.findById);
router.post('/update', usersController.update);
router.post('/profile/editPhoto', multipartMiddleware, usersController.editPhoto);
router.patch('/following', usersController.addRelationship);
router.delete('/following/:followId/:userId', usersController.removeRelationship);

module.exports = router;
