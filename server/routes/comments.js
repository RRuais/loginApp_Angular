var express = require('express');
var router = express.Router();
var messageController = require('../controllers/message.controller.js')
var commentController = require('../controllers/comment.controller.js')


router.post('/post', commentController.postComment);
// router.get('/getAllComments', commentController.getAllComments);
// router.delete('/delete/:id', commentController.deleteComment);
// router.get('/getUserComments/:id', commentController.getUserComments);


module.exports = router;
