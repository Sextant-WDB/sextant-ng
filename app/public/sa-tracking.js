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
ajax.keysUrl ='http://sextant-ng-b.herokuapp.com/api/0_0_1/provisionKeys';

ajax.createXHR = function() {
  try {
    return new XMLHttpRequest();
  } catch(e) {
    throw new Error('No XHR object.');
  }
};

ajax.post = function(url, data, callback) {
  var xhr = this.createXHR();

  xhr.open('POST', this.postUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };

  xhr.send(JSON.stringify(data));
};

var sendEvents = setInterval(function() {
  if (!events.length) return;

  ajax.post(ajax.dataUrl, events);

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
                var pageChange = {};

                pageChange.timeStamp = new Date().getTime();
                pageChange.from = previous.originalPath;
                pageChange.to = current.originalPath;

                events.push(pageChange);
            }
        }
        // Initial page load
        else {
          var pageLoad = {};

          pageLoad.timeStamp = new Date().getTime();
          pageLoad.page = window.parent.location;

          // Set the UUID if one exists
          var uuid = localStorage.getItem('uuid');
          if (uuid) { pageLoad.uuid = uuid; }

          // Get a UUID (if needed), session id, and write key
          ajax.post(ajax.keysUrl, pageLoad, function(responseText) {
            var response = JSON.parse(responseText);

            if (response.uniqueID) {
              localStorage.setItem('uuid', response.uniqueID);
            }

            sessionStorage.setItem('writeKey', responseText.writeKey);
            sessionStorage.setItem('sid', response.sessionID);
          });
        }
    });
});