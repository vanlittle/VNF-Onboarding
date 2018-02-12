
module.exports = function ($http,$state) {
    "ngInject";

    this.loginObj = {
        isAuthenticated: false,
        username :'',
        session_key : Math.random()        
    };

    this.login = function (username, password,callback) {

        var userCredentials = {
            'username'    : username,
            'password'    : password,
	    'session_key' : this.loginObj.session_key
        };
console.log(userCredentials);
console.log(this.loginObj);
        $http({
            method: 'POST',
            url: 'http://' + location.hostname + ':5000' + '/login',
            data: JSON.stringify(userCredentials)
        }).then(function successCallback(successResponse) {
            let serviceResult = successResponse.data;                       
            callback(serviceResult);
        }, function errorCallback(errorResponse) {
            callback(errorResponse.data);
        });
    };
console.log(this.loginObj);

    this.logOut = function () {
        this.loginObj.isAuthenticated = false;
        $state.go('login');
    };
/*
    this.changeAuth = function () {
        this.loginObj.isAuthenticated = false;
    };
*/

    this.getUserName = function(){
        return this.loginObj.username;
    };

   this.getSessionKey = function() {
      console.log("getSessionKey() called");
      console.log(this.loginObj);
      return this.loginObj.session_key;
   };
};



