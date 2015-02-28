var extend = require("../utils/extend.js");

var Video = function(attributes){
  this.attributes = extend({}, this._defaults, attributes);
}

extend(Video.prototype, {
  _defaults: {
    type: "youtube",

    height: 390,
    width: 640,

    time: "0s"
  },
  get: function(key){
    return this.attributes[key];
  },
  set: function(key, value){
    if(typeof key == "string"){
      this.attributes[key] = value;
    }else{
      extend(this.attributes, key);
    }
  },
  getTime: function(){
    return this.toTime(this.get("time"));
  },
  toTime: function(string){
    var match = string.match(/(\d+m){0,1}\s*(\d+s){0,1}/),
        time = 0;
    if(match[1]){
      time += parseInt(match[1],10)*60;
    }
    if(match[2]){
      time += parseInt(match[2],10);
    }
    return time;
  }
});

module.exports = Video;