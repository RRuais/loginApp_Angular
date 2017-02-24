var express = require('express');
var router = express.Router();
var messageController = require('../controllers/message.controller.js')


router.post('/', messageController.postMessage);
router.get('/getAllMessages', messageController.getAllMessages);
router.delete('/delete/:id', messageController.deleteMessage);
router.get('/getUserMessages/:id', messageController.getUserMessages);
router.get('/getMessage/:id', messageController.getMessage);
router.patch('/update', messageController.updateMessage);




module.exports = router;
