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