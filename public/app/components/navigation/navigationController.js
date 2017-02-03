angular.module('mainApp').directive('navigation', navigation);

function navigation() {
  return {
    restrict: 'E',
    templateUrl: '../app/components/navigation/navigation.html'
  };
};
