module.exports = {
  template: require('../templates/test.html'),
  controller: function (dataService) {
    "ngInject";

    dataService.setSubmitCallback(function () {
      return true;
    });

    this.inputs = dataService.generateInputs();
    this.vnfnickname = config.vnfnickname;
    this.inputsNames = {
      'vnfnickname': 'vnfnickname',
    };
      }
};
