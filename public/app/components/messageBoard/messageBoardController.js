(function() {
    angular.module('mainApp')
        .controller('MessageController', ['$scope', '$location', '$cookies', '$rootScope', 'MessageFactory', 'UsersFactory', function($scope, $location, $cookies, $rootScope, mf, uf) {

            $scope.checkUser = function() {
                if ($cookies.get('loggedUser')) {
                    return true;
                } else {
                    return false;
                };
            };

            $scope.postMessage = function() {
                var user = JSON.parse($cookies.get('loggedUser'));
                var newMessage = {
                    userId: user.id,
                    userEmail: user.email,
                    content: $scope.message,
                }
                mf.postMessage(newMessage, function(message) {

                });
                $scope.message = '';
                userMessages();
                allUsers();
            };

            function allMessages() {
                mf.getAllMessages(function(messages) {
                    messages.data.forEach(function(message) {
                        var id = message.userId;
                        uf.findById(id, function(user) {
                            var userImage = user.data.image;
                            message.userImage = userImage;
                        })
                    })
                    $scope.messages = messages.data;
                });
            };

            $scope.getAllMessages = function() {
                allMessages();
            };



            $scope.deleteMessage = function(messageId) {
                var loggedUser = JSON.parse($cookies.get('loggedUser'))
                mf.deleteMessage(messageId, loggedUser.id);
                userMessages();
                allUsers();
            };

            $scope.checkUserForDelete = function(userId) {
                var loggedUser = JSON.parse($cookies.get('loggedUser'));
                if (loggedUser.id === userId) {
                  return true;
                } else {
                  return false;
                };
            };

            function loggedUser() {
                return JSON.parse($cookies.get('loggedUser'));
            };

            $scope.getLoggedUser = function() {
                $scope.loggedUser = loggedUser();
            };

            function userMessages() {
                var loggedUser = JSON.parse($cookies.get('loggedUser'))
                mf.getUserMessages(loggedUser.id, function(messages) {
                    messages.data.forEach(function(message) {
                        var id = message.userId;
                        uf.findById(id, function(user) {
                            var userImage = user.data.image;
                            message.userImage = userImage;
                        })
                    })
                    $scope.messages = messages.data;
                })
            };

            $scope.getUserMessages = function() {
                userMessages();
            };

//////////// Users on the MessageBoard Functions ////////////////////////
//////////// Get all users except logged user ///////////////////////////

            function allUsers() {
                uf.getAllUsers(function(users) {
                    var currentUser = loggedUser();
                    console.log(currentUser);
                    var counter = 0;
                    for (var i=0; i < users.data.length; i++) {
                      if (users.data[i]._id === currentUser.id) {
                          break;
                      } else {
                          counter += 1;
                      };
                    };
                    users.data.splice(counter, 1)
                    $scope.users = users.data;
                });
            };

            $scope.getAllUsers = function() {
                allUsers();
            };



/////////////////////////////////// Comments ///////////////////////////////////

            // Show comments div in HTML
            $scope.comments = false;
            $scope.showComments = function() {
                if ($scope.comments === false) {
                    $scope.comments = true;
                } else {
                    $scope.comments = false;
                };
            };

            // $scope.postComment = function(messageId) {
            //
            //     var user = JSON.parse($cookies.get('loggedUser'));
            //
            //     var newComment = {
            //         content: $scope.comment,
            //         userId: user.id,
            //         userEmail: user.email,
            //         messageId: messageId
            //     };
            //
            //     console.log(newComment);
            //     mf.postComment(newComment, function(comments) {
            //
            //     });

                // $scope.message = '';
                // userMessages();
                // allUsers();

            // };

        }]); // End Controller
}()); // End Anonymous Function
