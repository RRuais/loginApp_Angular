const BASE_PATH = "/api/users";

angular.module('mainApp')
    .factory('UsersFactory', ['$http', '$location', function($http, $location) {

        var factory = {}

        factory.register = function(newUser, callback) {
            $http.post(`${BASE_PATH}`, newUser)
                .then(function(user) {
                    callback(user);
                })
                .catch((function(err) {
                  let errorMessage = err.data.message;
                  callback(null, errorMessage);
                }))
        };

        factory.login = function(user, callback) {
          $http.post(`${BASE_PATH}/login`, user)
          .then((creds) => {
            callback(creds);
          })
          .catch((err) => {
            callback(null, err);
          })
        };

        factory.getAllUsers = function(callback) {
            $http.get(BASE_PATH)
                .then(function(users) {
                    callback(users);
                }).catch(function(err) {
                  callback(err);
                })
        };

        factory.deleteUser = function(id) {
            $http.delete(`${BASE_PATH}/${id}`, id)
        };


        factory.findByEmail = function(user, callback) {
            let creds = user.email;
            $http({
                method: 'GET',
                url: `${BASE_PATH}/findByEmail/${creds}`,
                data: creds,
                headers: { 'Content-Type': 'application/json; charset=utf-8'},
            })
                .then(function(data) {
                  if (data) {
                    callback(data);
                  } else {
                    callback({message: "No email found"})
                  };
                });
        };

        factory.update = function(data, callback) {
          $http.post(`${BASE_PATH}/update`, data)
          .then(function(user) {
              callback(user);
          })
        };

        factory.findById = function(id, callback) {
          $http.get('/api/users/' + id, id)
              .then(function(data) {
                  callback(data);
              });
        };

////////////////// Followers and Following ////////////////////////////////////

        factory.addRelationship = function(relationship) {
            $http.patch('/api/users/following', relationship);
        };

        factory.removeRelationship = function(relationship) {
            $http.delete('/api/users/following/' + relationship.userToFollow + '/' + relationship.loggedUser);
        };


        return factory;
    }]);
