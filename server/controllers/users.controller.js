var User = require('../models/user.js');
var Message = require('../models/messages.js')
var fs = require('fs-extra');
var path = require('path');

module.exports.register = function(req, res) {
    var newUser = new User(req.body);

    //find by email in order to avoid dupe
    User.find({email: newUser.email})
      .then(function(users) {
        let user = users[0];

        if(user){
          res.status(409).json({message: "Email already exists"})
        }
      });

    User.createUser(newUser, function(err, user) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.json(user);
        };
    });
};

module.exports.login = function(req, res) {
  console.log("Started Login function in server"+req.body);
    User.find({email: req.body.email})
      .then(function(user) {
        console.log(user);
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
  // Delete user's messages
  User.findById({_id: req.params.id})
      .then(function(user) {
            var messages = user.messages
          messages.forEach(function(message) {
            Message.findByIdAndRemove(message).then(function(response) {
              console.log('Successfully deleted messages from user' + response);
            });
          });
          // Delete User
          User.remove({_id: req.params.id})
              .then(function() {
                  res.json(true);
              })
      }).catch(function(err) {
          res.status(500).json(err)
      })
};

module.exports.findByEmail = function(req, res) {
    console.log(req.params.email);
    User.find({email: req.params.email})
        .then(function(user) {
          console.log(user);
        if (user.length > 0) {
          var retUser = {
            name: user[0].name,
            email: user[0].email,
            birthday: user[0].birthday,
            following: user[0].following,
            followers: user[0].followers,
            messages: user[0].messages,
            image: user[0].image,
            id: user[0]._id
          };
          res.status(200).json(retUser);
        } else {
          res.status(200).json({message: "No user found"});
        }
        }).catch(function(err) {
            res.status(500).json(err)
        })
};

module.exports.findById = function(req, res) {
  User.findOne({_id: req.params.id})
      .then(function(user) {
          // console.log(user);
          // var retUser = {
          //   name: user.name,
          //   email: user.email,
          //   birthday: user.birthday,
          //   following: user.following,
          //   followers: user.followers,
          //   messages: user.messages,
          //   image: user.image,
          //   id: user._id
          // };

          // console.log(user);
          user.password = "";
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

    var userId = "589f98fa82eb9e0aee549ecb";
    var userToFollowId = req.body.userToFollowId;
    // console.log(userId);
    // console.log(userToFollowId);


    User.findByIdAndUpdate(userId, {$push: {"following": userToFollowId}})
      .then(function(user) {
        // console.log(user);
          User.findByIdAndUpdate(userToFollowId, {$push: {"followers": userId}})
          .then(function(user) {
            res.sendStatus(204);
            // console.log(user);
            // console.log('Success');
          })
      }).catch(function(err) {
        console.log(err);
      });
};

module.exports.removeRelationship = function(req, res) {

    // var userId = req.body.loggedUser;
    var userId = "589f98fa82eb9e0aee549ecb";
    // var userToFollow = req.body.userToFollow;
    var followId = req.params.followId;

    User.findByIdAndUpdate(userId, {$pull: {"following": followId}})
      .then(function(user) {

          User.findByIdAndUpdate(followId, {$pull: {"followers": userId}})
          .then(function(user) {
          res.sendStatus(204);
          })
      }).catch(function(err) {
        console.log(err);
      });
};
