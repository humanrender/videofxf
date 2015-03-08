module.exports = function(element, eventType){
  var event = document.createEvent('Event');
  event.initEvent(eventType, true, true);

  element.dispatchEvent(event);
  return event;
}