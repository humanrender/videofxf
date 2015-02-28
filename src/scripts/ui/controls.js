var extend = require("../utils/extend.js");

var Controls = function(){

}

extend(Controls.prototype,{
  initialize: function(element, model){
    var next = element.querySelectorAll("[data-vfxf-next]")[0];
    if(next){
      next
        .addEventListener("click", this.onNext.bind(this), false)
    }

    var prev = element.querySelectorAll("[data-vfxf-prev]")[0];
    if(prev){
      prev
        .addEventListener("click", this.onPrev.bind(this), false)
    }
  },
  onNext: function(e){
    e.preventDefault();
    var event = document.createEvent('Event');
    event.initEvent('getNextFrame', true, true);

    e.currentTarget.dispatchEvent(event);
  },
  onPrev: function(e){
    e.preventDefault();
    var event = document.createEvent('Event');
    event.initEvent('getPrevFrame', true, true);

    e.currentTarget.dispatchEvent(event);
  }
});

module.exports = Controls;