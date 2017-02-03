var express = require('express');
var router = express.Router();
var messageController = require('../controllers/message.controller.js')


router.post('/post', messageController.postMessage);
router.get('/getAllMessages', messageController.getAllMessages);
router.delete('/delete/:id', messageController.deleteMessage);
router.get('/getUserMessages/:id', messageController.getUserMessages);


module.exports = router;
