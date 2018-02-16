
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
module.exports = {
  template: require('../templates/login.html'),
  controller: function (authService, $state, $scope) {
    "ngInject";

    $scope.username = "";
    $scope.password = "";
    $scope.session_key = ""; 
    $scope.errorVisible = false;
    $scope.emptyCredentialsErrorVisible = false;
    $scope.currentUser = '';

    this.submit = function () {
      if ($scope.username != '' && $scope.password != '') {
        
        authService.login($scope.username, $scope.password, function (serviceResponse) {          
          if (serviceResponse == "true") {
            authService.loginObj.isAuthenticated = true;           
            authService.loginObj.username = $scope.username;            
            $state.go('wizard.vnf');
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
      // angular.forEach($scope.files, function (file) {
      //   console.log("appending file..")
      //   fd.append('file', file);
      // });
     
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
      //objXhr.setRequestHeader('Content-Type', 'multipart/form-data');
      objXhr.setRequestHeader('Authorization', '123456');
      //objXhr.setRequestHeader('Content-Type', 'multipart/form-data');
      //objXhr.setRequestHeader("Authorization", session_key);
      //objXhr.send(fd);
      objXhr.send(fd);
      //objXhr.send(fd,"session_key":authService.loginObj.session_key);

      // $http.post('http://localhost:62451/api/upload', fd,
      //   {
      //     transformRequest: angular.identity,
      //     headers: { 'Content-Type': undefined }
      //   }).then(function(){
      //     alert('uploaded successfully');
      //   }
      //   ,function(){
      //     alert('unable to upload');
      //   })
    }
  }
};
