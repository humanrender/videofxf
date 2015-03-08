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