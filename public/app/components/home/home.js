(function() {
    angular.module('mainApp')
        .controller('HomeController', ['$scope', 'UsersFactory', '$location', '$cookies', '$rootScope', 'Upload', '$stateParams', function($scope, uf, $location, $cookies, $rootScope, Upload, $stateParams) {

            $scope.checkUser = function() {
                if ($cookies.get('auth')) {
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
                uf.register(newUser, function(user, errMsg) {
                  if(errMsg) {
                    $scope.errors.push(errMsg)
                  }
                  else {
                    $location.url('success');
                  }
                });
            }; //End Register Function

            $scope.login = function(req, res) {
              if ($scope.user && $scope.user.password) {
                uf.login($scope.user, function(creds, err) {
                  if(err) {
                    $scope.error = err.data.message;
                  } else {
                    let user = JSON.stringify(creds);
                    $cookies.put('auth', user);
                    getUser();
                    $scope.user = "";
                    $location.url('messageBoard');
                  }
                });
              } else {
                $scope.error = {message: "Email or password incorrect"};
              };
            };

            $scope.logout = function() {
                $cookies.remove('auth');
                $location.url('register');
            };

            function allUsers() {
              uf.getAllUsers(function(users) {
                  $scope.users = users.data;
              });
            };

            $scope.getAllUsers = function() {
                allUsers();
            };

            function removeUser(userId) {
              uf.deleteUser(userId);
              allUsers();
            };

            $scope.deleteUser = function(userId) {
                removeUser(userId);
            };

            function getUser() {
              if ($cookies.get('auth')) {
                let user = JSON.parse($cookies.get('auth'));
                uf.findByEmail(user.data, function(user) {
                  $scope.user = user.data;
                });
              };
            };

            $scope.getLoggedUser = function() {
              getUser();
            };

            $scope.updateUser = function() {
              if ($scope.name) {
                uf.update({name: $scope.name, email: $scope.user.email}, function(user){
                  var loggedUser = JSON.stringify({data: {email: user.data.email, token: user.data.authToken, id: user.data._id}});
                  $cookies.put('auth', loggedUser);
                  getUser();
                  $scope.name = "";
                })
              } else if ($scope.birthday) {
                uf.update({name: $scope.user.name, email: $scope.user.email, birthday: $scope.birthday}, function(user){
                  var loggedUser = JSON.stringify({data: {email: user.data.email, token: user.data.authToken, id: user.data._id}});
                  $cookies.put('auth', loggedUser);
                  getUser();
                  $scope.birthday = "";
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
                Upload.upload({
                  url: 'api/users/profile/editPhoto',
                  method: 'POST',
                  data: {userId: $scope.user._id},
                  file: file
                }).progress(function(evt){
                  getUser();
                  $location.url('profile');
                }).success(function(data){

                }).error(function(error){
                  console.log(error);
                })
              }
            };

//////////////////// Followers and Following //////////////////////////////////

            $scope.addRelationship = function(id) {
              var loggedUser = JSON.parse($cookies.get('auth'));
              var relationship = {
                loggedUser: loggedUser.data.id,
                userToFollow: id
              }
              uf.addRelationship(relationship);
              allUsersExcept();
            };

            $scope.removeRelationship = function(id) {
              var loggedUser = JSON.parse($cookies.get('auth'));
              var relationship = {
                loggedUser: loggedUser.data.id,
                userToFollow: id
              }
              uf.removeRelationship(relationship);
              allUsersExcept();
            };

            function findFolowingUsers() {
              var loggedUser = JSON.parse($cookies.get('auth'));
              uf.findById(loggedUser.data.id, function(user) {
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
              if ($cookies.get('auth')) {
                // Getting all users
                uf.getAllUsers(function(users) {
                  let currentUser = JSON.parse($cookies.get('auth'));
                  // Splicing out the logged-in user
                  var counter = 0;
                  for (var i=0; i < users.data.length; i++) {
                    if (users.data[i]._id === currentUser.data.id) {
                      break;
                    } else {
                      counter += 1;
                    };
                  };
                  users.data.splice(counter, 1);
                  // Check the users for following
                  users.data.forEach(function(user){
                    uf.findById(currentUser.data.id, function(loggedUser) {
                      if (loggedUser.data.following.includes(user._id)) {
                        user.isFollowed = true;
                      } else {
                        user.isFollowed = false;
                      }
                    })
                  })//End ForEach loop
                  $scope.users = users.data;
                });
              };
            };// End -- all Users Except the Logged User Function

            $scope.getAllUsersExcept = function() {
                allUsersExcept();
            };

            allUsersExcept();


        }]); // End Main Controller
}()); // End Anonymous Function
