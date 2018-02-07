module.exports = {
    bindings: {
      value: '=', /* 2-way binding */
      steps: '=', /* 2-way binding */
      rangeTabIndex: '='
    },
    controller: function ($scope, $timeout) {
      "ngInject";

      $timeout(() => {
        const width = 300;
        this.stepWidth = width / this.steps.length;
        this.marginBar = 35;
        this.marginDot = 18;
        this.marginDotShadow = 13;

        this.ACTIVE = 'active';
        this.NO_CLASS = '';

        this.changeValue = function (index) {
          this.value = index;
        }.bind(this);

        this.keydown = (event) => {
          if (event.keyCode == 39) { /* Right arrow */
            if (this.value < this.steps.length - 1)
              this.value++;
          }
          if (event.keyCode == 37) { /* Left arrow */
            if (this.value > 0)
              this.value--;
          }
        }
      });
    },
    template: require("../templates/range_template.html")
};
