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
    template: require('../templates/forgotpassword.html'),
    controller: function (signupService,$scope, $http, $state) {
      "ngInject";

      $scope.username = "";
      $scope.emailid = "";
      $scope.passwordChangeSuccess = false;
      $scope.passwordChangeError = false;


      this.submit = function () {
          if (this.IsValid()) {
             if($scope.emailid == ""  && $scope.username != "") {
                credentials = {'username' : $scope.username };          
                signupService.generateNewPassword(credentials,function(serviceResponse) {
                if(serviceResponse == "True"){
                    $scope.passwordChangeSuccess = true 
                    document.getElementById("passwordChangeSuccessMessage").innerHTML = "New password sent to user's mail id. Please login with new password";
                }
                else if (serviceResponse == "False"){
                    $scope.passwordChangeError = true;
                    document.getElementById("passwordChangeErrorMessage").innerHTML = "There is No user with provided username in our database" ;
                }

           });
          }
          else if ($scope.emailid != ""  && $scope.username == ""){
	     credentials = {'emailaddress' : $scope.emailid };
             signupService.generateNewPassword(credentials,function(serviceResponse) {
             if(serviceResponse == "True"){
	         $scope.passwordChangeSuccess = true
                 document.getElementById("passwordChangeSuccessMessage").innerHTML = "New password sent to user's mail id. Please login with new password"
              }
              else if (serviceResponse == "False"){
                  $scope.passwordChangeError = true;
                  document.getElementById("passwordChangeErrorMessage").innerHTML = "There is No user with provided EmailId in our database";
              }

           }); 
         }
         this.clearCredentials();       
      } else {
        //$scope.emptyCredentialsErrorVisible = true;
        $scope.passwordChangeError = true;
        document.getElementById("passwordChangeErrorMessage").innerHTML = "Incorrect Inputs. Please enter either UserId or Password"
        this.clearCredentials();
      }
    };



      this.Cancel = function() {
        $state.go('login');
      };
 
      this.Login = function() {
	$state.go('login');
      };

      this.IsValid = function () {
        if (($scope.username == "" &&  $scope.emailid !== "" ) || ($scope.username !== "" && $scope.emailid == "")) {
          //this.setErrorVisibility(true,false);
          return true;
        }
        else {
          return false;
        }
      };

      /*this.setErrorVisibility = function(emptyFieldError,passwordFieldError){
        $scope.EmptyFieldErrorVisible = emptyFieldError;
        $scope.PasswordErrorVisible = passwordFieldError;
      }; */

      this.clearCredentials = function() {
        $scope.username = "";
        $scope.emailid = "";
      };
    }
  };

