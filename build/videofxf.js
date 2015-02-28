require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var STATES = {
      "loaded": "loaded",
      "loading": "loading",
      "new": "new"
    },
    state = STATES["new"],
    subscriptions = [];

var APILoader = {
  loaded: function(){
    if(window.YT && state != STATES["loaded"])
      state = STATES["loaded"];
    return state == STATES["loaded"];
  },
  subscribe: function(){
    subscriptions.push(Array.prototype.slice.call(arguments));
    
  },
  load: function(){
    if(this.loaded()) return;

    var originalCallback;

    if(window.onYouTubeIframeAPIReady
       && !window.onYouTubeIframeAPIReady.youtubefxf){
      originalCallback = window.onYouTubeIframeAPIReady;
    }
    window.onYouTubeIframeAPIReady = function(){
      if(originalCallback)
        originalCallback.call(this);
      APILoader.onYouTubeIframeAPIReady();
    }

    this.loadYoutubeAPI();
  },
  loadYoutubeAPI: function(){
    var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },
  onYouTubeIframeAPIReady: function(){
    var subscription,
        callback, context;
    while((subscription = subscriptions.pop())){
      callback = subscription[0];
      context = subscription[1] || this;
      callback.call(context);
    }
  }
};

module.exports = APILoader;
},{}],2:[function(require,module,exports){
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
},{"../utils/extend.js":4}],3:[function(require,module,exports){
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
  }
});

module.exports = Viewport;
},{"../utils/extend.js":4}],4:[function(require,module,exports){
module.exports = function(){
  var args = Array.prototype.slice.call(arguments),
      target = args.shift();
  args.forEach(function(options){
    var key;
    for(key in options){
      target[key] = options[key];
    }
  })
  return target;
}
},{}],5:[function(require,module,exports){
window.videofxf = (function(){
  
  var extend = require("./utils/extend.js"),
      APILoader = require("./core/api_loader.js"),
      Viewport = require("./ui/viewport.js"),
      Video = require("./models/video.js");

  var videofxf = function(element, options){
    this.element = element;
    this.model = this.getModel(element, options);
    this.viewport = new Viewport();
    this.initialize();
  };

  extend(videofxf.prototype, {
    initialize: function(){
      if(APILoader.loaded()){
        this.render();  
      }else{
        APILoader.subscribe(this.onAPILoaded, this);
        APILoader.load();
      }
    },
    onAPILoaded: function(){
      this.render();
    },
    render: function(){
      this.viewport.draw(this.element, this.model);
    },
    getModel: function(element, options){
      var attributes = {},
          video;

      attributes.videoId = element.getAttribute("data-vfxf-video-id");

      return new Video(extend(attributes, options));
    }
  });

  return videofxf;

})();
},{"./core/api_loader.js":1,"./models/video.js":2,"./ui/viewport.js":3,"./utils/extend.js":4}],"/src/scripts/ui/views/view_base.js":[function(require,module,exports){
var extend = require("../../utils/extend.js");

var ViewBase = function(){

};

extend(ViewBase.prototype,{
  draw: function(element, model){
    this.buildUI(element, model);
  },
  buildUI: function(element, model){
    console.log("ppp")
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
},{"../../utils/extend.js":4}],"/src/scripts/ui/views/youtube_view.js":[function(require,module,exports){
var ViewBase = require("/src/scripts/ui/views/view_base.js");

var YoutubeView = function(){
  YoutubeView._super.call(this);
}

ViewBase.extend(YoutubeView, {
  buildUI: function(element, model){
    var wrapper = document.createElement("div");
    wrapper.className = model.get("wrapperClass");
    element.appendChild(wrapper);

    var video = document.createElement("div");
    wrapper.appendChild( video )

    this.player = this.embedPlayer(video)    
  },
  embedPlayer: function(target){
    return new YT.Player(target, {
      height: model.get("height"),
      width: model.get("width"),
      videoId: model.get("videoId"),
      events:{
        onReady: this.onPlayerReady.bind(this)
      }
    });
  },
  onPlayerReady: function(){
    
  }
});

module.exports = YoutubeView;
},{"/src/scripts/ui/views/view_base.js":"/src/scripts/ui/views/view_base.js"}]},{},[5]);
