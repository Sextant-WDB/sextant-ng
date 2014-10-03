'use strict';

var _ = require('underscore');

module.exports = function(app) {
  app.controller('pageGraphController', function($scope){

    $scope.$watch('visits', function(){
      if( $scope.visits ) {
        var data = parseGraphData();
        graph(data);
      }
    });

    var parseGraphData = function(){
      var links = [];
      var landings = [];

      $scope.maxWeight = 1;

      $scope.visits.forEach(function(visit) {
        visit.events.forEach(function(event) {
          if(event.eventType === 'pageChange') {
            var tempLink = {};
            tempLink.source = event.from;
            tempLink.target = event.to;

            if(links.length === 0) {
              tempLink.count = 1;
              links.push(tempLink);
            } else {
              var item = _.findWhere(links, {source: tempLink.source, target: tempLink.target});

              if(item) {
                item.count++;
              } else {
                tempLink.count = 1;
                links.push(tempLink);
              }
            }
          } else if (event.eventType === 'pageLoad') {
            var tempLanding = {};
            tempLanding.page = event.page;

            if(landings.length === 0) {
              tempLanding.count = 1;
              landings.push(tempLanding);
            } else {
              var temp = _.findWhere(landings, {page: tempLanding.page});

              if(temp) {
                temp.count++;
              } else {
                tempLanding.count = 1;
                landings.push(tempLanding);
              }
            }
          }
        });
      });

      links.forEach(function(link) {
        if (link.count > $scope.maxWeight)
          $scope.maxWeight = link.count;
      });

      var nodes = {};

      links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
        link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
      });

      $scope.landingMax = 1;

      landings.forEach(function(landing) {
        if(nodes[landing.page]) {
          nodes[landing.page].count = landing.count;
          if(landing.count > $scope.landingMax) {
            $scope.landingMax = landing.count;
          }
        }
      });

      return { links: links, nodes: nodes };
    };

    var graph = function(data) {

      var width = 640;
      var height = 300;

      var force = $scope.d3.layout.force()
        .nodes($scope.d3.values(data.nodes))
        .links(data.links)
        .alpha(0.5)
        .linkDistance([120])
        .linkStrength(1)
        .charge([-1200])
        .size([width, height])
        .on('tick', tick)
        .start();

      var svg = $scope.d3.select('#page-graph-wrapper').append('svg')
        .attr('width', width)
        .attr('height', height);

      var link = svg.selectAll('.link')
          .data(force.links())
        .enter().append('svg:path')
          .attr('class', 'link')
          .style('stroke-width', function(d) { return (d.count / $scope.maxWeight) * 5; });


      var node = svg.selectAll('.node')
          .data(force.nodes())
        .enter().append('g')
          .attr('class', 'node')
          .call(force.drag);

      node.append('circle')
        .attr('r', function(d) {
          if(!!d.count) return 10 + (d.count / $scope.landingMax * 10);
          return 10;
        })
        .style('fill', function(d){
          var w = (!!d.count) ?  255 - (255 * d.count / $scope.landingMax) : 255;
          return 'rgb(215,'+ w+','+ w +')';
        });

      node.append('text')
        .attr('x', 20)
        .attr('y', -10)
        .text(function(d) { return d.name; });



      function tick() {
        link.attr('d', function(d) {
          var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy);
          return 'M' +
            d.source.x + ',' +
            d.source.y + 'A' +
            dr + ',' + dr + ' 0 0,1 ' +
            d.target.x + ',' +
            d.target.y;
        });

        node
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
      }
    };
  });
};