(function() {
    angular.module('mainApp')
        .controller('HomeController', ['$scope', 'UsersFactory', '$location', '$cookies', '$rootScope', 'Upload', function($scope, uf, $location, $cookies, $rootScope, Upload) {

            $scope.checkUser = function() {
                if ($cookies.get('loggedUser')) {
                    return true;
                } else {
                    return false;
                };
            };

            $scope.register = function() {
                $scope.errors = []
                if ($scope.password != $scope.password2) {
                    $scope.errors.push({message: "Passwords need to match!"});
                };
                var newUser = $scope.user;
                uf.findByEmail(newUser.email, function(response) {
                  console.log(response);
                    if (response.data.message) {
                      uf.register(newUser, function(user) {
                        $location.url('success');
                      });
                    } else {
                      $scope.errors.push({message: "Email already exists"});
                    }
                });
            }; //End Register Function

            $scope.login = function(req, res) {
              if ($scope.user && $scope.user.password) {
                uf.login($scope.user, function(user) {
                    if (user.data.message) {
                        $scope.error = {message: "Email or password incorrect"};
                    } else {
                      var loggedUser = JSON.stringify({email: user.data[0].email, id: user.data[0]._id, image: user.data[0].image});
                      $cookies.put('loggedUser', loggedUser);
                      loggedUserDetails();
                      $location.url('messageBoard');
                    }
                });
              } else {
                $scope.error = {message: "Email or password incorrect"};
              };
            };

            $scope.logout = function() {
                $cookies.remove('loggedUser');
                $location.url('register');
            };



            $scope.getAllUsers = function() {
                uf.getAllUsers(function(users) {
                    $scope.users = users.data;
                });
            };

            $scope.deleteUser = function(userId) {
                uf.deleteUser(userId);
            };

            function getUser() {
              if ($cookies.get('loggedUser')) {
                $scope.loggedUser = JSON.parse($cookies.get('loggedUser'));
                return $scope.loggedUser;
              };
            };

            $scope.getLoggedUser = function() {
              getUser();
            };

            function loggedUserDetails() {
              if ($cookies.get('loggedUser')) {
                var user = JSON.parse($cookies.get('loggedUser'));
                uf.findByEmail(user.email, function(user) {
                    $scope.userDetails = user.data;
                });
              }
            };

            loggedUserDetails();

            $scope.getUserDetails = function() {
                loggedUserDetails();
            };


            $scope.updateUser = function() {
                  if ($scope.name) {
                    uf.update({name: $scope.name, email: $scope.userDetails.email}, function(data){
                      var loggedUser = JSON.stringify({email: data.data.email, id: data.data._id});
                      $cookies.put('loggedUser', loggedUser);
                      loggedUserDetails();
                      $scope.name = "";
                    })
                  } else if ($scope.birthday) {
                    uf.update({name: $scope.userDetails.name, email: $scope.userDetails.email, birthday: $scope.birthday}, function(data){
                      var loggedUser = JSON.stringify({email: data.data.email, id: data.data._id});
                      $cookies.put('loggedUser', loggedUser);
                      loggedUserDetails();
                    })
                  }
            };

            //Upload Image
            $scope.$watch(function() {
              return $scope.file
            }, function() {
                $scope.upload($scope.file)
            });
            $scope.upload = function (file) {
              if (file){
                var user = getUser()
                Upload.upload({
                  url: 'users/profile/editPhoto',
                  method: 'POST',
                  data: {userId: user.id},
                  file: file
                }).progress(function(evt){
                  console.log("firing");
                  console.log(evt);
                  loggedUserDetails();
                }).success(function(data){
                }).error(function(error){
                  console.log(error);
                })
              }
            };

//////////////////// Followers and Following //////////////////////////////////

            $scope.addRelationship = function(id) {
              console.log('Add relationship');
              var loggedUser = JSON.parse($cookies.get('loggedUser'));
              var relationship = {
                loggedUser: loggedUser.id,
                userToFollow: id
              }
              uf.addRelationship(relationship);
              allUsersExcept();
            };

            $scope.removeRelationship = function(id) {
              console.log('removeRelationship');
              var loggedUser = JSON.parse($cookies.get('loggedUser'));
              var relationship = {
                loggedUser: loggedUser.id,
                userToFollow: id
              }
              uf.removeRelationship(relationship);
              allUsersExcept();
            };

            function findFolowingUsers() {
              var loggedUser = JSON.parse($cookies.get('loggedUser'));
              uf.findById(loggedUser.id, function(user) {
                var users = [];
                user.data.following.forEach(function(userId) {
                  if (userId !== null) {
                    uf.findById(userId, function(retUser) {
                      retUser.data.isFollowed = true;
                      users.push(retUser.data);
                    })
                  }
                })
                  $scope.users = users;
              })
            };


            $scope.findFollowings = function() {
              findFolowingUsers();
            };

            function allUsersExcept() {
              if ($cookies.get('loggedUser')) {

                uf.getAllUsers(function(users) {
                  var currentUser = getUser();
                  var counter = 0;
                  for (var i=0; i < users.data.length; i++) {
                    if (users.data[i]._id === currentUser.id) {
                      break;
                    } else {
                      counter += 1;
                    };
                  };
                  users.data.splice(counter, 1);
                  users.data.forEach(function(user){
                    checkUserFollowing(user._id, function(res) {
                      if (res === true) {
                        user.isFollowed = true;
                      } else {
                        user.isFollowed = false;
                      }
                    })
                  })
                  $scope.users = users.data;
                });
              };
            };// End -- all Users Except the Logged User Function

            $scope.getAllUsersExcept = function() {
                allUsersExcept();
            };

            allUsersExcept();

            function checkUserFollowing(userId, callback) {
              var user = getUser();
              uf.findByEmail(user.email, function(user) {
                  user.data.following.forEach(function(id) {
                      if (id === userId) {
                        callback(true);
                      } else {
                        callback(false);
                      };
                  });
              });
            };



        }]); // End Main Controller
}()); // End Anonymous Function
