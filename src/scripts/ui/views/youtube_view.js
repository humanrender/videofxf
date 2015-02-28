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