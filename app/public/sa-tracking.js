'use strict';

var _sa = _sa || {};

_sa.events = [];
_sa.sendInterval = 5000;

// Update these with your app directory:
_sa.dataUrl = 'http://localhost:3000/api/0_0_1/data';
_sa.keysUrl = 'http://localhost:3000/api/0_0_1/provisionKeys';

// For AJAX
_sa.createXHR = function() {
  try {
    return new XMLHttpRequest();
  } catch(e) {
    throw new Error('No XHR object.');
  }
};

// Execute a POST request
_sa.post = function(url, data, callback, async) {
  var xhr = this.createXHR();

  xhr.open('POST', url, typeof async === 'undefined' ? true : false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.timeout = 2000;

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200 && callback) {
      callback(xhr.responseText);
    }
  };

  xhr.send(JSON.stringify(data));
};

// Stamp the request body with credentials before posting
_sa.send= function(url, data, callback, async) {

  if(!_sa.writeKey && url !== _sa.keysUrl) {
    clearInterval(_sa.sendEvents);
    throw new Error('No write key.');
  }

  var message = {};

  message.uniqueID = _sa.uuid || localStorage.getItem('uuid');
  message.sessionID = _sa.sid;
  message.writeKey = _sa.writeKey;
  message.events = data;

  _sa.post(url, message, callback, async);
};

// Trim event down to desired information
_sa.processEvent = function(e) {

  // Desired event attributes
  var eventProps = ['type', 'timeStamp'];

  // Desired event target attributes
  var targetProps = ['nodeName', 'textContent', 'innerHTML'];

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

  _sa.send(_sa.dataUrl, _sa.events);

  _sa.events = [];
}, _sa.sendInterval);

_sa.angularListener = function() {
  if(!window.angular) return;

  // HTML element where ng-app is defined
  var ngAppNode = document.getElementsByClassName('ng-scope')[0];
  console.log('ngAppNode: ' + ngAppNode);

   // Convert the element into an Angular element to access the $rootScope
  var ngApp = angular.element(ngAppNode);
  console.log('ngApp: ' + ngApp);

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
// window.addEventListener('load', function() {

(function() {
  var pageLoad = {};

  pageLoad.timeStamp = new Date().getTime();
  pageLoad.page = window.parent.location.href;

  // Get a UUID (if needed), session id, and write key
  _sa.send(_sa.keysUrl, pageLoad, function(responseText) {

    var response = JSON.parse(responseText);

    if (response.uniqueID) {
        localStorage.setItem('uuid', response.uniqueID);
    }

    _sa.uuid = localStorage.getItem('uuid') || response.uniqueID;
    _sa.sid = response.sessionID;
    _sa.writeKey = response.writeKey;
  });

  setTimeout(_sa.angularListener, 1000);

  // _sa.angularListener();
}());

window.addEventListener('load', function() {
  console.log('page load registered!');
  console.log(document.getElementsByClassName('ng-scope')[0]);
});

// Send beforeunload event along with any prior events before the page closes
window.addEventListener('beforeunload', function( e ) {

  clearInterval(_sa.sendEvents);

  _sa.events.push(_sa.processEvent(e));

  _sa.send(_sa.dataUrl, _sa.events, null, false);
});