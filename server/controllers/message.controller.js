var Message = require('../models/messages.js');
var Comment = require('../models/comments.js');


module.exports.postMessage = function(req, res) {
    Message.create(req.body)
        .then(function(message) {
            res.status(201).json(message)
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

module.exports.getAllMessages = function(req, res) {
    Message.find({})
        .then(function(messages) {
            res.status(200).json(messages);
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

module.exports.getUserMessages = function(req, res) {
    Message.find({userId: req.params.id})
        .then(function(messages) {
            res.status(200).json(messages);
        }).catch(function(err) {
            res.status(500).json(err);
        })
};



module.exports.deleteMessage = function(req, res) {
    Message.remove({_id: req.params.id})
        .then(function() {
          Comment.remove({messageId: req.params.id })
            .then(function() {
              res.json(true);
            })
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

module.exports.getMessage = function(req, res) {
    Message.findOne({_id: req.params.id})
        .then(function(message) {
            res.status(200).json(message)
        }).catch(function(err) {
            res.status(400).json(err)
        });
};
