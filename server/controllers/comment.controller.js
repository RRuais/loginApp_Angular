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
    Comment.findByIdAndRemove(req.params.commentId)
        .then(function(res) {
            res.status(200).json({message: "Successfully deleted comment"})
        }).catch(function(err) {
            res.status(500);
            res.json({message: "Failed to delete comment"});
        });
};

module.exports.updateComment = function(req, res) {
    console.log(req.body);
    Comment.findByIdAndUpdate(req.body.commentId, req.body)
        .then(function(result) {
          console.log(result);
            res.status(200).json(result)
        }).catch(function(err) {
            res.status(500);
            res.json(err);
        });
};
