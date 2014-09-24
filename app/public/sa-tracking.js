'use strict';

var _sa = _sa || {};

_sa.events = [];
_sa.requestInterval = 5000;

_sa.dataUrl ='http://sextant-ng-b.herokuapp.com/api/0_0_1/data';
_sa.keysUrl ='http://sextant-ng-b.herokuapp.com/api/0_0_1/provisionKeys';

// For AJAX
_sa.createXHR = function() {
  try {
    return new XMLHttpRequest();
  } catch(e) {
    throw new Error('No XHR object.');
  }
};

// Execute a POST request
_sa.post = function(url, data, callback) {
  var xhr = this.createXHR();

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };

  xhr.send(JSON.stringify(data));
};

// Trim event down to desired information
_sa.processEvent = function(e) {

  // Desired event attributes
  var eventProps = ['type', 'timeStamp'];

  // Desired event target attributes
  var targetProps = ['nodeName', 'innerHTML'];

  // Trimmed event
  var trimmed = {};

  // Only save the whitelisted attributes
  eventProps.forEach(function(prop) {
    if (e[prop]) { trimmed[prop] = e[prop]; }
  });

  // If the event had a target save its attributes too
  if(e.target) {
    targetProps.forEach(function(prop) {
      if(e.target[prop]) { trimmed[prop] = e.target[prop]; }
    });
  }

  return trimmed;
};

// Automatically send any collected events
_sa.sendEvents = setInterval(function() {
  if (!_sa.events.length) return;

  _sa.post(_sa.dataUrl, _sa.events);

  _sa.events = [];
}, _sa.requestInterval);

_sa.angularListener = function() {
    if(!window.angular) return;

    // HTML element where ng-app is defined
    var ngAppNode = document.getElementsByClassName('ng-scope')[0];

     // Convert the element into an Angular element to access the $rootScope
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

                _sa.events.push(pageChange);
            }
        }
    });
};

// Capture and process all clicks
window.addEventListener('click', function(e) {
    e = event || window.event;

    _sa.events.push(_sa.processEvent(e));
});

// Handle initial page load
window.addEventListener('load', function() {

    var pageLoad = {};

    pageLoad.timeStamp = new Date().getTime();
    pageLoad.page = window.parent.location;

    // Set the UUID if one exists
    var uuid = localStorage.getItem('uuid');
    if (uuid) { pageLoad.uuid = uuid; }

    // Get a UUID (if needed), session id, and write key
    _sa.post(_sa.keysUrl, pageLoad, function(responseText) {
        var response = JSON.parse(responseText);

        if (response.uniqueID) {
            localStorage.setItem('uuid', response.uniqueID);
        }

        sessionStorage.setItem('writeKey', responseText.writeKey);
        sessionStorage.setItem('sid', response.sessionID);
    });

    _sa.angularListener();

    window.removeEventListener('load');
});