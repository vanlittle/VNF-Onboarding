const TOOLTIPS = require('../config/tooltips.json');

module.exports = {
  template: require('../templates/scripts_definitions.html'),
  controller: function (dataService,authService,$scope) {
    "ngInject";

    this.DEFAULT_INPUT_TYPE = 'url';
    this.INPUT_PLACEHOLDER = 'Type here';
    this.FORM_SUBMIT_CLASS = '';
    this.TOOLTIP = TOOLTIPS.GENERAL_SCRIPTS;

    $scope.files = [];
    this.upload_response = false;
    $("#Upload_Files").prop("disabled",true);
    this.scriptsInputs = dataService.getScripts();

    this.empty = function (x) {
      return x == undefined || x === '' || x == null;
    };

    function emptyToString (x) {
      return x == undefined || x == null ? '' : x;
    }

    this.forms = {};

    dataService.setSubmitCallback(() => {
      this.FORM_SUBMIT_CLASS = 'submit';
      const isValid = this.forms.scriptsForm.$valid;

    if (isValid === true) {

      const config = {
          create: emptyToString(this.scriptsInputs['create'].value),
          config: emptyToString(this.scriptsInputs['configure'].value),
          delete: emptyToString(this.scriptsInputs['delete'].value)
        };

        dataService.setScripts(config);
      }

      return isValid;
    });

    $scope.setFiles = function (element) {
      $("#Upload_Files").prop("disabled",false);
      $scope.files.push(element.files[0]);
    };

    $scope.uploadFile = function () {
      console.log('In upload file: $scope.files');
      console.log($scope.files);
      var fd = new FormData();

      angular.forEach($scope.files, function (file) {
        fd.append('file', file);
      });
      var session_key = authService.getSessionKey();
      var username = authService.getUserName();
      if ($scope.files.length) {
        this.upload_response = true;
        var objXhr = new XMLHttpRequest();
        objXhr.open("POST", 'http://' + location.hostname + ':5000' + '/upload');
        objXhr.setRequestHeader('Authorization', session_key);
        objXhr.setRequestHeader('username', username);
        /*objXhr.onload = function () {
           // do something to response
           console.log(this.responseText);
           document.getElementById("upload_response").innerHTML = this.responseText;
        }; */
        objXhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("uploadresponse").innerHTML =
            this.responseText;
          }
       };
 
        objXhr.send(fd);
      } else {
        alert('Please choose files to upload..')
      }
      //$scope.files = [];
    }   

      
  }
};
