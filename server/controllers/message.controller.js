var Message = require('../models/messages.js');
var User = require('../models/user.js');

module.exports.postMessage = function(req, res) {

    Message.create(req.body)
        .then(function(message) {
            var userId = message.userId;
            var messageId = message._id;
            User.findByIdAndUpdate(userId, {
                $push: {"messages": messageId}
            }, function(err, data) {
                if (err) {
                    res.json(err);
                } else {
                    console.log(data);
                    res.json(data);
                }
            });
        })
        .catch(function(err) {
            res.status(500).json(err);
        })
};

module.exports.getAllMessages = function(req, res) {
    Message.find({}).sort({
            date: -1
        })
        .then(function(messages) {
            res.status(200).json(messages);
        }).catch(function(err) {
            res.status(500).json(err);
        })
};

module.exports.getUserMessages = function(req, res) {
    Message.find({
            userId: req.params.id
        }).sort({
            date: -1
        })
        .then(function(messages) {
            res.status(200).json(messages);
        }).catch(function(err) {
            res.status(500).json(err);
        })
};



module.exports.deleteMessage = function(req, res) {
    var userId = req.body.userId;
    User.findById(userId)
        .then(function(user) {
            var messages = user.messages;
            messages.forEach(function(message) {
                User.findByIdAndUpdate(userId, {
                        $pull: {"messages": message}
                    })
                    .then(function() {
                      console.log("Success");
                    })
            })
        }).catch(function(err) {
            console.log("Error");
        })
    Message.remove({
            _id: req.params.id
        })
        .then(function() {
            console.log("Success");
            res.json(true);
        })
        .catch(function(err) {
            res.status(500);
            res.json(err);
        })
};
