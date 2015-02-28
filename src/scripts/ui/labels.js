var extend = require("../utils/extend.js");

var Labels = function(){
};

extend(Labels.prototype, {
  initialize: function(element){
    this.steps = element.querySelectorAll("[data-vfxf-steps]")[0];
    this.currentStep = element.querySelectorAll("[data-vfxf-current-step]")[0];
  },
  setSteps: function(steps){
    if(this.steps){
      this.steps.innerHTML = steps;
    }
  },
  setCurrentStep: function(currentStep){
    if(this.currentStep){
      this.currentStep.innerHTML = currentStep;
    }
  }
});

module.exports = Labels;