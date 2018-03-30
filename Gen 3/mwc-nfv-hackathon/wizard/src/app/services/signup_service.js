/*###########################################################################
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
 
#############################################################################*/
module.exports = function (authService,$http,$state) {
    "ngInject";

    this.signupObj = {
        //isAuthenticated: false,
        'username' : '',
        'password':'',
        'confirmpassword'	: ''	
    };

    this.signup = function (username, emailadd,password,confirmPassword,callback) {

        var userCredentials = {
            'username': username,
	    'emailaddress' : emailadd,
            'password': password,
            'confirmpassword' : confirmPassword	
        };
console.log(userCredentials);
        $http({
            method: 'POST',
            url: 'http://' + location.hostname + ':5000' + '/backend' + '/signup',
            data: JSON.stringify(userCredentials)
        }).then(function successCallback(successResponse) {
            let serviceResult = successResponse.data;                       
            callback(serviceResult);
        }, function errorCallback(errorResponse) {
            callback(errorResponse.data);
        });
    };

this.generateNewPassword = function(useridentity,callback) {
    
       $http({
            method: 'POST',
            url: 'http://' + location.hostname + ':5000' + '/backend' + '/forgetpassword',
            data: JSON.stringify(useridentity)
        }).then(function successCallback(successResponse) {
            let serviceResult = successResponse.data;
            callback(serviceResult);
        }, function errorCallback(errorResponse) {
            callback(errorResponse.data);
        });
    };



/*    this.logOut = function () {
        this.loginObj.isAuthenticated = false;
        $state.go('login');
    };
*/
/*
    this.changeAuth = function () {
        this.loginObj.isAuthenticated = false;
    };
*/

};




