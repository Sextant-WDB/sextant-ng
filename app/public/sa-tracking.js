'use strict';

var events = [];
var requestInterval = 5000;

window.addEventListener('click', function(e) {
    e = event || window.event;

    events.push(processEvent(e));
});

var processEvent = function(e) {

  // Event attributes
  var eventProps = ['type', 'timeStamp'];

  // Event target attributes
  var targetProps = ['nodeName', 'innerHTML'];

  // Trimmed event
  var result = {};

  eventProps.forEach(function(prop) {
    if (e[prop]) { result[prop] = e[prop]; }
  });

  if(e.target) {
    targetProps.forEach(function(prop) {
      if(e.target[prop]) { result[prop] = e.target[prop]; }
    });
  }

  console.log('event result: ' + JSON.stringify(result));
  return result;
};

var PostRequest = function() {
  var xhr;

  try {
    xhr = new XMLHttpRequest();
  } catch(e) {
    throw new Error('No XHR object');
  }

  var url = 'http://sextant-ng-b.herokuapp.com/api/0_0_1/data';

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  return xhr;
};


var sendEvents = setInterval(function() {
  if (!events.length) return;

  var request = new PostRequest();
  request.send(JSON.stringify(events));

  events = [];
}, requestInterval);