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
},{"../utils/extend.js":7}],3:[function(require,module,exports){
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
},{"../utils/extend.js":7}],4:[function(require,module,exports){
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
},{"../utils/extend.js":7}],5:[function(require,module,exports){
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
},{"../utils/extend.js":7}],6:[function(require,module,exports){
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
},{"../utils/extend.js":7}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
module.exports = function(element, eventType){
  var event = document.createEvent('Event');
  event.initEvent(eventType, true, true);

  element.dispatchEvent(event);
  return event;
}
},{}],9:[function(require,module,exports){
window.videofxf = (function(){
  
  var extend = require("./utils/extend.js"),
      APILoader = require("./core/api_loader.js"),
      Viewport = require("./ui/viewport.js"),
      Video = require("./models/video.js"),
      Controls = require("./ui/controls.js"),
      Labels = require("./ui/labels.js"),
      Steps = require("./models/steps.js");

  var videofxf = function(element, options){
    this.element = element;
    this.model = this.getModel(element, options);
    this.viewport = new Viewport();
    this.controls = new Controls();
    this.steps = new Steps();
    this.labels = new Labels();

    this.focused = false;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBodyMouseDown = this.onBodyMouseDown.bind(this);

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
      this.element
        .addEventListener("getNextFrame", this.onGetNextFrame.bind(this), false)
      this.element
        .addEventListener("getPrevFrame", this.onGetPrevFrame.bind(this), false);
      this.element
        .addEventListener("nextFrame", this.onNextFrame.bind(this), false);
      this.element
        .addEventListener("mousedown", this.onMouseDown.bind(this), false);
      this.render();
    },
    render: function(){
      this.viewport.draw(this.element, this.model);
      this.controls.initialize(this.element, this.model);
      this.labels.initialize(this.element);
      this.labels
        .setSteps(this.steps.total);
      this.updateLabels();
    },
    getModel: function(element, options){
      var attributes = {},
          video;

      attributes.videoId = element.getAttribute("data-vfxf-video-id");
      attributes.time = element.getAttribute("data-vfxf-start-at");

      return new Video(extend(attributes, options));
    },
    next: function(){
      if(this.steps.next()){
        this.viewport.nextFrame();
        this.updateLabels();
      }
    },
    prev: function(){
      if(this.steps.prev()){
        this.viewport.prevFrame();
        this.updateLabels();
      }
    },
    onGetNextFrame: function(){
      this.next();
    },
    onGetPrevFrame: function(){
      this.prev();
    },
    onNextFrame: function(e){
      e.preventDefault();
      this.steps.next()
      this.viewport.seek(this.model.getTime() + (this.steps.currentStep/25));

      this.updateLabels();
    },
    onMouseDown: function(e){
      e.stopPropagation();
      this.focus();
    },
    onKeyDown: function(e){
      switch(e.keyCode){
        case 39: //Right
          this.next();
          break;
        case 37: //Left
          this.prev();
          break;
      }
    },
    focus: function(){
      document.body
        .addEventListener("keydown", this.onKeyDown, false);
      document.body
        .addEventListener("mousedown", this.onBodyMouseDown);
      this.focused = true;
    },
    blur: function(){
      document.body
        .removeEventListener("keydown", this.onKeyDown);
      document.body
        .removeEventListener("mousedown", this.onBodyMouseDown);
      this.focused = false;
    },
    onBodyMouseDown: function(){
      this.blur();
    },
    updateLabels: function(){
      this.labels.setCurrentStep(this.steps.currentStep+1);
    }
  });

  return videofxf;

})();
},{"./core/api_loader.js":1,"./models/steps.js":2,"./models/video.js":3,"./ui/controls.js":4,"./ui/labels.js":5,"./ui/viewport.js":6,"./utils/extend.js":7}],"/src/scripts/ui/views/view_base.js":[function(require,module,exports){
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
},{"../../utils/extend.js":7}],"/src/scripts/ui/views/youtube_view.js":[function(require,module,exports){
var trigger = require("../../utils/trigger.js"),
    ViewBase = require("/src/scripts/ui/views/view_base.js"),
    YoutubeView = function(){
      YoutubeView._super.call(this);
    }

ViewBase.extend(YoutubeView, {
  ready: false,
  buildUI: function(element, model){
    var wrapper = element.querySelectorAll("[data-vfxf-wrapper]")[0];
    
    var video = document.createElement("div");
    wrapper.appendChild( video )

    this.player = this.embedPlayer(video, model)    
  },
  embedPlayer: function(target, model){
    return new YT.Player(target, {
      height: model.get("height"),
      width: model.get("width"),
      videoId: model.get("videoId"),
      events:{
        onReady: this.onPlayerReady.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this)
      },
      playerVars: {
        autohide: 1,
        autoplay: 1,
        start: model.getTime(),
        controls: 0,
        disablekb: 1
      }
    });
  },
  onPlayerReady: function(){
    this.player.setVolume(0);
    this.player.setPlaybackRate(1);
  },
  onPlayerStateChange: function(e){
    if(e.data == 1){
      if(this.ready){
        var nextFrameEvent = trigger(this.player.getIframe(), "nextFrame");
        if(!e.defaultPrevented) this.pause();
      }else{
        this.pause();
        this.ready = true;
        trigger(this.player.getIframe(), "playerReady");
      }
    }
  },
  seek: function(time){
    if(!this.player)
      return;

    this.player.seekTo(time);
  },
  play: function(){
    this.player.playVideo();
  },
  pause: function(){
    this.player.pauseVideo();
  },
  nextFrame: function(){
    this.changeFrame(1);
  },
  prevFrame: function(){
    this.changeFrame(-1);
  },
  changeFrame: function(frames){
    var time = this.player.getCurrentTime() + (frames/25);
    this.player.seekTo(time);
  }
});

module.exports = YoutubeView;
},{"../../utils/trigger.js":8,"/src/scripts/ui/views/view_base.js":"/src/scripts/ui/views/view_base.js"}]},{},[9]);
