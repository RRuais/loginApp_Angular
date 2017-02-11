angular.module('mainApp')
    .factory('MessageFactory', ['$http', '$location', function($http, $location) {
        var factory = {}

        factory.postMessage = function(message, callback) {
            $http.post('/messages/post', message)
                .then(function(message) {
                    console.log(message);
                }).catch(function(err) {

                })
        };

        factory.getAllMessages = function(callback) {
            $http.get('/messages/getAllMessages')
                .then(function(messages) {
                    callback(messages);
                }).catch(function(err) {
                    console.log(err);
                })
        };

        factory.deleteMessage = function(messageId, userId) {
            console.log(messageId);
            console.log(userId);
            var data = {
                messageId: messageId,
                userId: userId
            }
            $http({
                method: 'DELETE',
                url: '/messages/delete/' + messageId,
                data: {
                    userId: userId
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            })
        };

        factory.getUserMessages = function(id, callback) {
            $http.get('/messages/getUserMessages/' + id, id)
                .then(function(messages) {
                    callback(messages);
                }).catch(function(err) {
                    console.log(err);
                })
        };

/////////////////////////////////// Comments ///////////////////////////////////

        factory.postComment = function(newComment, callback) {
          console.log(newComment);
        };

        return factory;
    }]);
