angular.module('passmaker.configuration', [
  'ui.router',
  'ui.bootstrap.modal',
  'ui.bootstrap.tpls'
])

.config(["$stateProvider", function($stateProvider) {
  $stateProvider.state('configuration', {
    url: '/configuration',
    templateUrl: 'configuration/configuration.tpl.html',
    controller: 'ConfigurationCtrl',
    data: { pageTitle: 'Configuration' }
  });
}])

.controller('ConfigurationCtrl', ["$scope", "profile", "pMaker", "passMakerConf", "$modal", "$q", function($scope, profile, pMaker, passMakerConf, $modal, $q) {

  $scope.hashAlgorithms = pMaker.supportedAlgorithms();

  $scope.profile = profile;

  $scope.addException = function() {
    $scope.profile.exceptions = $scope.profile.exceptions || [];
    $scope.profile.exceptions.push({
      'patterns': [],
      'passwordLength': { 'override': false, 'value': '' },
      'modifier': { 'override': false, 'value': '' },
      'constraints': []
    });
  };

  $scope.removeException = function(i) {
    $scope.profile.exceptions.splice(i, 1);
  };

  $scope.suggestConstraints = function(query) {
    var characterSets = [
      'digit', 'letter', 'lowercase letter', 'uppercase letter', 'of ,.-!'
    ];
    var tags = [];
    var qryStruct = /^(?:(\d+)(?:\s(.*))?)|(?:.*)$/i.exec(query);
    var inputAmount = qryStruct[1] || '1';
    var inputCharacterSet = qryStruct[2] || '';
    angular.forEach(characterSets, function(characterSet) {
      if (characterSet.indexOf(inputCharacterSet) > -1) {
        tags.push(inputAmount + ' ' + characterSet);
      }
    });
    var deferred = $q.defer();
    deferred.resolve(tags);
    return deferred.promise;
  };

  $scope.restoreConfiguration = function() {
    passMakerConf.load();
  };


  $scope.showConfiguration = function() {
    var stringProfile = angular.toJson(profile, true);
    $modal.open({
      template: '<div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">Configuration</h4></div><div class="modal-body"><pre>' + stringProfile + '</pre></div>'
    });
  };

  $scope.saveConfiguration = function() {
    passMakerConf.save();
  };
}])

;
