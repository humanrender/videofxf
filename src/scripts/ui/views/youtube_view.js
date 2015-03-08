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