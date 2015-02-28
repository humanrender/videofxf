var extend = require("../../utils/extend.js");

var ViewBase = function(){

};

extend(ViewBase.prototype,{
  draw: function(element, model){
    this.buildUI(element, model);
  },
  buildUI: function(element, model){
  },
  seek: function(time){
  },
  play: function(){
  },
  pause: function(){
  },
  nextFrame: function(){
  },
  prevFrame: function(){
  }
});

ViewBase.extend = function(target, proto){
  var tmp = function(){};
  tmp.prototype = ViewBase.prototype;
  target.prototype = new tmp();
  extend(target.prototype, proto)
  target._super = ViewBase;
};

module.exports = ViewBase;