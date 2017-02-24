angular.module('mainApp')
    .factory('MessageFactory', ['$http', '$location', function($http, $location) {
        var factory = {}

        factory.postMessage = function(message, callback) {
            $http.post('/api/messages', message)
                .then(function(message) {
                    console.log(message);
                }).catch(function(err) {

                })
        };

        factory.getAllMessages = function(callback) {
            $http.get('/api/messages/getAllMessages')
                .then(function(messages) {
                    callback(messages);
                }).catch(function(err) {
                    console.log(err);
                })
        };

        factory.deleteMessage = function(messageId, userId) {
            var data = {
                messageId: messageId,
                userId: userId
            }
            $http({
                method: 'DELETE',
                url: '/api/messages/delete/' + messageId,
                data: {
                    userId: userId
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            })
        };

        factory.getUserMessages = function(id, callback) {
            $http.get('/api/messages/getUserMessages/' + id, id)
                .then(function(messages) {
                    callback(messages);
                }).catch(function(err) {
                    console.log(err);
                });
        };

        factory.getMessage = function(messageId, callback) {
            $http.get(`api/messages/getMessage/${messageId}`)
              .then(function(message) {
                callback(message);
              }).catch(function(err) {
                callback(err);
              });
        };

        factory.updateMessage = function(message) {
          console.log(message);
          $http.patch(`api/messages/update`, message)
            .then(function(response) {
              console.log(response);
            }).catch(function(err) {
              console.log(err);
            })
        };


/////////////////////////////////// Comments ///////////////////////////////////

        factory.postComment = function(comment) {
          $http.post(`api/comments/postComment`, comment)
            .then(function(response) {
              console.log(response);
            }).catch(function(err) {
              console.log(err);
            })
        };

        factory.updateComment = function(comment) {
          console.log(comment);
          $http.patch(`api/comments/update`, comment)
            .then(function(response) {
              console.log(response);
            }).catch(function(err) {
              console.log(err);
            })
        };

        factory.getComments = function(messageId, callback) {
          $http.get(`api/comments/getComments/${messageId}`)
            .then(function(comments) {
              callback(comments);
            }).catch(function(err) {
              callback(err);
            })
        };

        factory.deleteComment = function(commentId) {
          $http.delete(`api/comments/${commentId}`)
            .then(function(response) {
                console.log(response);
            }).catch(function(err) {
              console.log(err);
            })

        };

        return factory;
    }]);
