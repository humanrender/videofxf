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