var extend = require("../utils/extend.js");

var Viewport = function(){

};

extend(Viewport.prototype,{
  draw: function(element, model) {
    this.view = this.getView(model.get("type"));
    this.view.draw(element, model);
  },
  getView: function(type){
    var viewClass = require("/src/scripts/ui/views/"+type+"_view.js");
    return new viewClass();
  },
  seek: function(time){
    this.view.seek(time);
  },
  play: function(){
    this.view.play();
  },
  pause: function(){
    this.view.pause();
  },
  nextFrame: function(){
    this.view.nextFrame();
  },
  prevFrame: function(){
    this.view.prevFrame();
  }
});

module.exports = Viewport;