var User = require('../models/user.js');
var Message = require('../models/messages.js')
var Comment = require('../models/comments.js')
var fs = require('fs-extra');
var path = require('path');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongoose = require('mongoose')

mongoose.Promise = global.Promise;

function _findByEmail(email) {
  return User.findOne({email: email});
}

function _generateAuthToken(user) {
  let d = Q.defer();
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.name, salt, function(err, hash) {
        if(err) {
          d.reject(err);
          return;
        }
        user.authToken = hash;
        user.save()
        .then(function(user) {
          d.resolve(user);
        })
      });
  });
  return d.promise;
};

module.exports.register = function(req, res) {
    var newUser = new User(req.body);
    _findByEmail(newUser.email)
      .then(function(user) {
        if(user){
          res.status(409).json({message: "Email already exists"})
        };
      });
    User.createUser(newUser, function(err, user) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(201).json(user);
        };
    });
};

function createAdminUser() {
  _findByEmail('admin@admin.com')
    .then(function(user) {
      if(!user){
        var newUser = new User({
          name: 'admin',
          email: 'admin@admin.com',
          password: 'password',
          isAdmin: true
        });
        User.createUser(newUser, function(err, user) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfullly Created Admin User" + user);
          };
        });
      };
    });
};

createAdminUser();


module.exports.login = function(req, res) {
    _findByEmail(req.body.email)
      .then(function(user) {
        if (user) {
          var hashPassword = user.password;
          var testPassword = req.body.password;
          User.comparePassword(testPassword, hashPassword, function(err, isMatch) {
            if (isMatch) {
              _generateAuthToken(user)
              .then(function (user){
                res.status(200).json({email: user.email, token: user.authToken, id: user._id, isAdmin: user.isAdmin});
              })
            } else {
              console.log("Compare password failed");
              res.status(500).json({message: "Email or password incorrect"});
            }
          });// End Compare Password
        } else {
          res.status(500).json({message: "Email or password incorrect"});
        };
      });
};

module.exports.getAllUsers = function(req, res) {
    User.find({})
        .then(function(users) {
            users.forEach(function(user) {
              user.password = "";
            })
            res.status(200).json(users);

        }).catch(function(err) {
            res.status(500).json(err);
        })
};

module.exports.deleteUser = function(req, res) {
    User.remove({_id: req.params.id})
        .then(function(data) {
            Message.remove({userId: req.params.id})
                .then(function(data) {
                    Comment.remove({userId: req.params.id})
                        .then(function(data) {
                            res.json(true);
                        })
                })
        }).catch(function(err) {
            res.status(500).json(err)
        })
};


module.exports.findByEmail = function(req, res) {
    _findByEmail(req.params.email).then(function(user) {
      if (user) {
        user.password = ''
        res.status(200).json(user);
      } else {
        res.status(200).json({message: "No user found"});
      };
    });
};

module.exports.findById = function(req, res) {
  User.findOne({_id: req.params.id})
      .then(function(user) {
          user.password = "";
          res.status(200).json(user);
      }).catch(function(err) {
          res.status(500).json(err)
      })
};

module.exports.update = function(req, res) {
  User.findOneAndUpdate({email: req.body.email}, req.body, {returnOriginal: false}, function(err, user) {
    if (err) {
      res.status(500).json(err);
    } else {
      user.password = "";
      res.status(200).json(user);
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
    var userToFollowId = req.body.userToFollow;
    User.findByIdAndUpdate(userId, {$push: {"following": userToFollowId}})
      .then(function(user) {
          User.findByIdAndUpdate(userToFollowId, {$push: {"followers": userId}})
          .then(function(user) {
            res.sendStatus(204);
          })
      }).catch(function(err) {
        console.log(err);
      });
};

module.exports.removeRelationship = function(req, res) {
    var userId = req.params.userId;
    var followId = req.params.followId;
    User.findByIdAndUpdate(userId, {$pull: {"following": followId}})
      .then(function(user) {
          User.findByIdAndUpdate(followId, {$pull: {"followers": userId}})
          .then(function(user) {
          res.sendStatus(204);
          })
      }).catch(function(err) {
        res.sendStatus(500);
      });
};
