var ViewBase = require("/src/scripts/ui/views/view_base.js");

var YoutubeView = function(){
  YoutubeView._super.call(this);
}

ViewBase.extend(YoutubeView, {
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
        autoplay: 0,
        start: model.getTime(),
        controls: 0
      }
    });
  },
  onPlayerReady: function(){
    var iframe = this.player.getIframe(),
        event = document.createEvent('Event');
    event.initEvent('playerReady', true, true);

    
    this.player.setPlaybackRate(1);
    iframe.dispatchEvent(event);
  },
  onPlayerStateChange: function(e){
    if(e.data == 1)
      this.pause();
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