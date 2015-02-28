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