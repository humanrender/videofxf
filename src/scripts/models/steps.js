var extend = require("../utils/extend.js");

var Steps = function(options){
  options = extend({}, this._defaults, options);
  this.currentStep = options.startAt;
  this.total = options.total;
};

extend(Steps.prototype, {
  _defaults:{
    total: 10,
    startAt: 0
  },
  next: function(){
    var nextIndex = this.currentStep + 1;
    if(nextIndex < this.total){
      this.currentStep = nextIndex;
      return true;
    }
    return false;
  },
  prev: function(){
    var prevIndex = this.currentStep - 1;
    if(prevIndex >= 0){
      this.currentStep = prevIndex;
      return true;
    }
    return false;
  }
})

module.exports = Steps;