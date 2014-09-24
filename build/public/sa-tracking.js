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

var ajax = {};

ajax.postUrl ='http://sextant-ng-b.herokuapp.com/api/0_0_1/data';

ajax.createXHR = function() {
  try {
    return new XMLHttpRequest();
  } catch(e) {
    throw new Error('No XHR object.');
  }

};

ajax.post = function(data) {
  var xhr = this.createXHR();

  xhr.open('POST', this.postUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(data);
};

var sendEvents = setInterval(function() {
  if (!events.length) return;

  ajax.post(JSON.stringify(events));

  events = [];
}, requestInterval);

window.addEventListener('load', function() {

    if(!window.angular) return;

    // HTML element where ng-app is defined
    var ngAppNode = document.getElementsByClassName('ng-scope')[0];

     // Convert element to an Angular element in order to access the $rootScope
    var ngApp = angular.element(ngAppNode);

    // Listen to route changes on the $routeProvider
    ngApp.scope().$on('$routeChangeSuccess', function(e, current, previous) {

        if (previous) {
            // Navigation between two angular routes
            if(previous.originalPath && current.originalPath) {
                console.log('from %s to %s', previous.originalPath, current.originalPath);
            }
        }
        // Initial page load
        else {
          console.log('initial load');
        }
    });
});