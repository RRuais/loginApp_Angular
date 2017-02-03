var User = require('../models/user.js');
var Message = require('../models/messages.js')
var fs = require('fs-extra');
var path = require('path');

module.exports.register = function(req, res) {
    var newUser = new User(req.body);

    User.createUser(newUser, function(err, user) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.json(user);
        };
    });
};

module.exports.login = function(req, res) {
    User.find({email: req.body.email})
      .then(function(user) {
        var hashPassword = user[0].password;
        var testPassword = req.body.password;
        User.comparePassword(testPassword, hashPassword, function(err, isMatch) {
            if (isMatch) {
                console.log('Success');
                res.status(200).json(user)
            } else {
                console.log("Failure");
                res.json({message: "Failure"});
            }
        });
      })
};

module.exports.getAllUsers = function(req, res) {
    User.find({})
        .then(function(users) {
            res.status(200).json(users);

        }).catch(function(err) {
            res.status(500).json(err);
        })
};

module.exports.deleteUser = function(req, res) {
  // Delete messages
  User.findById({_id: req.params.id})
      .then(function(user) {
            var messages = user.messages
          messages.forEach(function(message) {
            Message.findByIdAndRemove(message);
          });
          User.remove({_id: req.params.id})
              .then(function() {
                  res.json(true);
              })
      }).catch(function(err) {
          res.status(500).json(err)
      })
};

module.exports.findByEmail = function(req, res) {
    User.find({email: req.params.email})
        .then(function(user) {
            res.status(200).json(user);
        }).catch(function(err) {
            res.status(500).json(err)
        })
};

module.exports.findById = function(req, res) {
  User.findOne({_id: req.params.id})
      .then(function(user) {
          res.status(200).json(user);
      }).catch(function(err) {
          res.status(500).json(err)
      })
};

module.exports.update = function(req, res) {
  User.findOneAndUpdate({email: req.body.email}, req.body, {returnOriginal: false}, function(err, data) {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  });
};

module.exports.editPhoto = function(req, res) {
    var file = req.files.file;
    var userId = req.body.userId;
    var uploadDate = new Date().toISOString();
    var tempPath = String(file.path);
    var targetPath = path.join(__dirname, "../../uploads/" + userId + file.originalFilename);
    var savePath = "/uploads/" + userId + file.originalFilename;
    fs.rename(tempPath, targetPath, function (err){
       if (err){
           console.log(err)
       } else {
           User.findById(userId, function(err, user){
               var user = user;
               user.image = savePath;
               user.save(function(err){
                   if (err){
                       console.log("failed save")
                       res.status(500);
                   } else {
                       console.log("save successful");
                       res.status(200);
                   }
               })
           })
       }
   })
};

module.exports.addRelationship = function(req, res) {

    var userId = req.body.loggedUser;
    var userToFollow = req.body.userToFollow;

    User.findByIdAndUpdate(userId, {$push: {"following": userToFollow}})
      .then(function(user) {
        console.log(user);
          User.findByIdAndUpdate(userToFollow, {$push: {"followers": userId}})
          .then(function(user) {
            console.log(user);
            console.log('Success');
          })
      }).catch(function(err) {
        console.log(err);
      });
};

module.exports.removeRelationship = function(req, res) {

    var userId = req.body.loggedUser;
    var userToFollow = req.body.userToFollow;

    User.findByIdAndUpdate(userId, {$pull: {"following": userToFollow}})
      .then(function(user) {
        console.log(user);
          User.findByIdAndUpdate(userToFollow, {$pull: {"followers": userId}})
          .then(function(user) {
            console.log(user);
            console.log('Success');
          })
      }).catch(function(err) {
        console.log(err);
      });
};
