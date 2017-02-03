angular.module('mainApp')
    .factory('UsersFactory', ['$http', '$location', function($http, $location) {
        var factory = {}

        factory.register = function(newUser, callback) {
            $http.post('/users/register', newUser)
                .then(function(user) {
                    callback(user);
                });
        };

        factory.login = function(user, callback) {
            $http.get('/users/findByEmail/' + user.email, user.email)
                .then(function(foundEmail) {
                    if (foundEmail.data.length > 0) {
                        $http.post('/users/login', user)
                            .then(function(response) {
                                callback(response);
                            })
                    } else {
                        var response = {data: {message: 'Failure'}};
                        callback(response)
                    };
                });

        };

        factory.getAllUsers = function(callback) {
            $http.get('/users/getAllUsers')
                .then(function(users) {
                    callback(users);
                }).catch(function(err) {
                    console.log(err);
                })
        };

        factory.deleteUser = function(id) {
            $http.delete('/users/delete/' + id, id)
        };


        factory.findByEmail = function(email, callback) {
            $http.get('/users/findByEmail/' + email, email)
                .then(function(data) {
                    callback(data);
                });
        };

        factory.update = function(data, callback) {

          $http.post('/users/update', data)
          .then(function(user) {
              callback(user);
          })
        };

        factory.findById = function(id, callback) {
          $http.get('/users/findById/' + id, id)
              .then(function(data) {
                  callback(data);
              });
        };

////////////////// Followers and Following ////////////////////////////////////

        factory.addRelationship = function(relationship) {
            $http.post('/users/addRelationship', relationship);
        };

        factory.removeRelationship = function(relationship) {
            $http.post('/users/removeRelationship', relationship);
        };


        return factory;
    }]);
