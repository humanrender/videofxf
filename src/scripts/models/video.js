var extend = require("../utils/extend.js");

var Video = function(attributes){
  this.attributes = extend({}, this._defaults, attributes);
}

extend(Video.prototype, {
  _defaults: {
    type: "youtube",

    height: 390,
    width: 640,

    wrapperClass: "vfxf-video__wrapper"
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
  }
});

module.exports = Video;