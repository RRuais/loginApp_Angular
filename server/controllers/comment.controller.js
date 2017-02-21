var Message = require('../models/messages.js');
var User = require('../models/user.js');
var Comment = require('../models/comments.js');

module.exports.postComment = function(req, res) {
    Comment.create(req.body)
        .then(function(comment) {
            res.status(201).json(comment)
        }).catch(function(err) {
            res.status(500).json(err);
        })
};

module.exports.getComments = function(req, res) {
    Comment.find({
            messageId: req.params.messageId
        }).sort({
            date: -1
        })
        .then(function(comments) {
            res.status(200).json(comments);
        }).catch(function(err) {
            res.status(500).json(err);
        })
};

module.exports.deleteComment = function(req, res) {
    Comment.findByIdAndRemove(req.body.commentId)
        .then(function(res) {
            res.status(200).json(true)
        }).catch(function(err) {
            res.status(500);
            res.json(err);
    });
};
