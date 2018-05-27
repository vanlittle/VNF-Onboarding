
/*#######################################################################
##
# Copyright 2017-2018 VMware Inc.
# This file is part of VNF-ONboarding
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# For those usages not covered by the Apache License, Version 2.0 please
# contact:  osslegalrouting@vmware.com
 
##
 
########################################################################*/
const TOOLTIPS = require('../config/tooltips.json');
module.exports = {
  template: require('../templates/login.html'),
  controller: function (authService, dataService, $state, $scope) {
    "ngInject";

    $scope.username = "";
    $scope.password = "";
    $scope.session_key = ""; 
    $scope.errorVisible = false;
    $scope.emptyCredentialsErrorVisible = false;
    $scope.currentUser = '';
    this.LOGIN_INFO_TOOLTIP=TOOLTIPS.LOGIN_INFO_TOOLTIP;

    this.submit = function () {
      if ($scope.username != '' && $scope.password != '') {
        
        authService.login($scope.username, $scope.password, function (serviceResponse) {          
          if (serviceResponse == "true") {
            authService.loginObj.isAuthenticated = true;           
            authService.loginObj.username = $scope.username; 
            dataService.setusername($scope.username);
            dataService.setsessionkey(authService.loginObj.session_key);           
            //$state.go('wizard.vnf');
            $state.go('wizard.vnfdef');
          }
          else {            
            $scope.clearCredentials();                       
            $scope.errorVisible = true;
            $scope.emptyCredentialsErrorVisible = false;
          }
        });
      } else {
        $scope.emptyCredentialsErrorVisible = true;
      }
    };

    $scope.clearCredentials = function () {
      $scope.username = "";
      $scope.password = "";
    };
    $scope.setFiles = function (element) {
      console.log('In SetFiles..');
      console.log(element);
      $scope.files = element.files[0];
      console.log("$scope.files");
      console.log($scope.files);
    };

    $scope.uploadFile = function () {
      console.log('In upload file');      
      console.log($scope.files);

      var fd = new FormData();
      fd.append('file',$scope.files);
     
     
      session_key = authService.loginObj.session_key; 
      console.log(fd);
      console.log(config)
      var data = {
		     'session_key' : session_key
		       };
      console.log(data);
      angular.forEach(data, function (value, key) {
                    fd.append(key, value);
                });
      var objXhr = new XMLHttpRequest();
      objXhr.open("POST", "http://10.172.137.224:5000/upload");
      objXhr.setRequestHeader('Authorization', '123456');
      objXhr.send(fd);
      }
  }
};
