var express = require('express');
var router = express.Router();
var messageController = require('../controllers/message.controller.js')
var commentController = require('../controllers/comment.controller.js')


router.post('/postComment', commentController.postComment);
router.get('/getComments/:messageId', commentController.getComments);
router.delete('/:commentId', commentController.deleteComment);
router.patch('/update', commentController.updateComment);



module.exports = router;
