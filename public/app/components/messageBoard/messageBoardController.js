(function() {
    angular.module('mainApp')
        .controller('MessageController', ['$scope', '$location', '$cookies', '$rootScope', 'MessageFactory', 'UsersFactory', '$stateParams', function($scope, $location, $cookies, $rootScope, mf, uf, $stateParams) {

            $scope.checkUser = function() {
                if ($cookies.get('loggedUser')) {
                    return true;
                } else {
                    return false;
                };
            };

            $scope.postMessage = function() {
                var user = JSON.parse($cookies.get('auth'));
                var newMessage = {
                    userId: user.data.id,
                    userEmail: user.data.email,
                    content: $scope.message,
                };
                mf.postMessage(newMessage, function(message) {

                });
                $scope.message = '';
                $('.modal').modal('hide');
                userMessages();
            };

            $scope.updateMessage = function(messageId) {
                let message = {
                    messageId: messageId,
                    content: $scope.message2
                };
                mf.updateMessage(message);
                $scope.message = '';
                $('.modal').modal('hide');
                userMessages();
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
                var loggedUser = JSON.parse($cookies.get('auth'))
                mf.deleteMessage(messageId, loggedUser.data._id);
                userMessages();
                $location.url('messageBoard');
            };

            $scope.checkUserForDelete = function(userId) {
                var loggedUser = JSON.parse($cookies.get('auth'));
                if (loggedUser.data.id === userId) {
                    return true;
                } else {
                    return false;
                };
            };

            $scope.checkUserForDeleteComment = function(userId) {
                var loggedUser = JSON.parse($cookies.get('auth'));
                if (loggedUser.data.id === userId) {
                    return true;
                } else {
                    return false;
                };
            };

            function userMessages() {
                var loggedUser = JSON.parse($cookies.get('auth'))
                mf.getUserMessages(loggedUser.data.id, function(messages) {
                    messages.data.forEach(function(message) {
                        var id = message.userId;
                        uf.findById(id, function(user) {
                            var userImage = user.data.image;
                            message.userImage = userImage;
                        });
                    });
                    $scope.messages = messages.data;
                });
            };

            $scope.getUserMessages = function() {
                userMessages();
            };

            function friendsMessages() {
                var totalMessages = [];
                var loggedUser = JSON.parse($cookies.get('auth'));
                uf.findById(loggedUser.data.id, function(user) {
                    user.data.following.forEach(function(userId) {
                        if (userId != null) {
                            mf.getUserMessages(userId, function(messages) {
                                messages.data.forEach(function(message) {
                                    var id = message.userId;
                                    uf.findById(id, function(user) {
                                        var userImage = user.data.image;
                                        message.userImage = userImage;
                                    });
                                    totalMessages.push(message)
                                });
                            })
                        };
                    });
                });
                $scope.messages = totalMessages;
            };

            $scope.getFriendsMessages = function() {
                friendsMessages();
            };


            function showMessageComments() {
                messageId = $stateParams.id;
                //Get Message
                mf.getMessage(messageId, function(message) {
                    uf.findById(message.data.userId, function(user) {
                        let currentMessage = message.data;
                        currentMessage.userImage = user.data.image;
                        $scope.message = currentMessage;
                        mf.getComments(messageId, function(comments) {
                            comments.data.forEach(function(comment) {
                                uf.findById(comment.userId, function(user) {
                                    comment.userImage = user.data.image;
                                })
                            })
                            $scope.comments = comments.data;
                        })
                    })
                })
            };

            $scope.showComments = function() {
                showMessageComments();
            };

            $scope.postComment = function(mesageId) {
                let user = JSON.parse($cookies.get('auth'));
                let comment = {
                    content: $scope.comment,
                    userId: user.data.id,
                    userEmail: user.data.email,
                    messageId: messageId
                };
                mf.postComment(comment);
                $scope.comment = "";
                $('.modal').modal('hide');
                showMessageComments()
            };

            function deleteComment(commentId) {
                mf.deleteComment(commentId);
            };

            $scope.delete = function(commentId, messageId) {
                deleteComment(commentId, messageId);
                showMessageComments();
            };

            $scope.updateComment = function(ids) {
                let user = JSON.parse($cookies.get('auth'));
                let comment = {
                    content: $scope.comment2,
                    userId: user.data.id,
                    userEmail: user.data.email,
                    messageId: ids.messageId,
                    commentId: ids.commentId
                };
                mf.updateComment(comment);
                $scope.comment2 = "";
                $('.modal').modal('hide');
                showMessageComments()
            };



        }]); // End Controller
}()); // End Anonymous Function
