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
 
########################################################################### */
module.exports = {
    template: require('../templates/signup.html'),
    controller: function (signupService,$scope, $http, $state) {
      "ngInject";

      $scope.username = "";
      $scope.emailid = "";
      $scope.password = "";
      $scope.confirmPassword = "";
      $scope.EmptyFieldErrorVisible = false;
      $scope.PasswordErrorVisible = false;
      $scope.UserSignupSuccessful = false;
      $scope.LoginNewUser = false;
      $scope.UserSignupError = false;


      this.submit = function () {
        if (this.IsValid()) {
          //alert('details submitted successfully!!');
           this.setErrorVisibility(false,false); 
      
           signupService.signup($scope.username,$scope.emailid, $scope.password,$scope.confirmPassword, function (serviceResponse) {
           
            if (serviceResponse == "True") {
             console.log('user registered successfully');           
             console.log(serviceResponse);
             $scope.UserSignupSuccessful = true;
             $scope.LoginNewUser = true;
             document.getElementById("signupresponse").innerHTML = "User Registration Successful. Login with new user."
	     //$scope.LoginNewUser = true;
             $scope.clearCredentials($scope);
             //$state.go('login');
            }
            else {            
              // $scope.clearCredentials();                       
              //$scope.errorVisible = true;
              //$scope.emptyCredentialsErrorVisible = false;
	        console.log("registration failed")
	      //state.go('login');	
              console.log(serviceResponse);
              //this.clearCredentials();
              $scope.UserSignupError = true;
              document.getElementById("signuperror").innerHTML = "User Registration Failed. Username or Emailid already exists.";
	      $scope.clearCredentials();
          }
        });
      } else {
        //$scope.emptyCredentialsErrorVisible = true;
      }
    };



      this.Cancel = function() {
        $state.go('login');
      };
 
      this.Login = function() {
	$state.go('login');
      };

      this.IsValid = function () {
        if ($scope.username == "" &&
          $scope.password == "" &&
          $scope.confirmPassword == "") {
          // $scope.EmptyFieldErrorVisible = true;
          // $scope.PasswordErrorVisible = false;
          this.setErrorVisibility(true,false);
          return false;
        } else if ($scope.password !== $scope.confirmPassword) {
          // $scope.EmptyFieldErrorVisible = false;
          // $scope.PasswordErrorVisible = true;
          this.setErrorVisibility(false,true);
          return false;
        }
        return true;
      };

      this.setErrorVisibility = function(emptyFieldError,passwordFieldError){
        $scope.EmptyFieldErrorVisible = emptyFieldError;
        $scope.PasswordErrorVisible = passwordFieldError;
      };

      $scope.clearCredentials = function() {
        $scope.username = "";
        $scope.password = "";
        $scope.emailid = "";
        $scope.confirmPassword = "";
      };
    }
  };

