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

      console.log(landings);
      console.log(nodes);

      landings.forEach(function(landing) {
        if(nodes[landing.page]) {
          nodes[landing.page].count = landing.count;
          if(landing.count > $scope.landingMax) {
            $scope.landingMax = landing.count;
          }
        }
      });

      console.log(nodes);
      console.log(links);
      return { links: links, nodes: nodes };
    };

    var graph = function(data) {
      console.log('grahping');
      var width = 960;
      var height = 500;

      var force = $scope.d3.layout.force()
        .nodes($scope.d3.values(data.nodes))
        .links(data.links)
        .size([width, height])
        .linkDistance(60)
        .charge(-300)
        .on('tick', tick)
        .start();

      var svg = $scope.d3.select('#page-graph-wrapper').append('svg')
        .attr('width', width)
        .attr('height', height);

      var link = svg.selectAll('.link')
          .data(force.links())
        .enter().append('line')
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
        });

      node.append('text')
        .attr('x', 12)
        .attr('dy', '.35em')
        .text(function(d) { return d.name; });

      function tick() {
        link
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

        node
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
      }
    };
  });
};