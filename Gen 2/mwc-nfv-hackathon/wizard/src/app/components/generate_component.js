const fileSaver = require('file-saver');
const saveAs = fileSaver.saveAs;

module.exports = {
  template: require('../templates/generate.html'),
  controller: function (dataService) {
    "ngInject";

    dataService.setSubmitCallback(function () {
      return true;
    });

    this.saveToFile = function () {
      dataService.sendData((data, name) => {
        const blob = new Blob([data], {type: "application/x-gzip;charset=utf-8"});
        saveAs(blob, name);
      });
    };
  }
};
