var extend = require("../utils/extend.js");

var Steps = function(options){
  options = extend({}, this._defaults, options);
  this.index = options.startAt;
  this.steps = options.steps;
};

extend(Steps.prototype, {
  _defaults:{
    steps: 10,
    startAt: 0
  },
  next: function(){
    var nextIndex = this.index + 1;
    if(nextIndex < this.steps){
      this.index = nextIndex;
      return true;
    }
    return false;
  },
  prev: function(){
    var prevIndex = this.index - 1;
    if(prevIndex >= 0){
      this.index = prevIndex;
      return true;
    }
    return false;
  }
})

module.exports = Steps;