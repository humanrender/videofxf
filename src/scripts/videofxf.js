window.videofxf = (function(){
  
  var extend = require("./utils/extend.js"),
      APILoader = require("./core/api_loader.js"),
      Viewport = require("./ui/viewport.js"),
      Video = require("./models/video.js"),
      Controls = require("./ui/controls.js"),
      Steps = require("./models/steps.js");

  var videofxf = function(element, options){
    this.element = element;
    this.model = this.getModel(element, options);
    this.viewport = new Viewport();
    this.controls = new Controls();
    this.steps = new Steps();
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
        .addEventListener("playerReady", this.onPlayerReady.bind(this), false);
      this.element
        .addEventListener("getNextFrame", this.onGetNextFrame.bind(this), false)
      this.element
        .addEventListener("getPrevFrame", this.onGetPrevFrame.bind(this), false);
      this.render();
    },
    render: function(){
      this.viewport.draw(this.element, this.model);
      this.controls.initialize(this.element, this.model);
    },
    getModel: function(element, options){
      var attributes = {},
          video;

      attributes.videoId = element.getAttribute("data-vfxf-video-id");
      attributes.time = element.getAttribute("data-vfxf-start-at");

      return new Video(extend(attributes, options));
    },
    onPlayerReady: function(e){
      this.viewport.seek(this.model.getTime());
    },
    onGetNextFrame: function(){
      if(this.steps.next()){
        this.viewport.nextFrame();
      }
    },
    onGetPrevFrame: function(){
      if(this.steps.prev()){
        this.viewport.prevFrame();
      }
    }
  });

  return videofxf;

})();