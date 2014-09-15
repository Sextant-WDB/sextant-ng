'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-browserify');

  var allJavaScriptFilePaths = ['app/js/**/*.js','models/**/*.js','routes/**/*.js','server.js'];

  grunt.initConfig({
    clean: {
      dev: {
        src: ['build/']
      }
    },

    copy: {
      dev: {
        expand: true,
        cwd: 'app/',
        src: ['*.html', '*.css', 'views/**/*.html'],
        dest: 'build/',
        filter: 'isFile'
      }
    },

    jscs: {
      src: allJavaScriptFilePaths,
      options: {
        config: '.jscsrc',
      }
    },

    jshint: {
      all: allJavaScriptFilePaths,
      options: {
        jshintrc: true
      }
    },

    browserify: {
      dev: {
        options: {
          transform: ['debowerify'],
          debug: true
        },
        src: ['app/js/**/*.js'],
        dest: 'build/bundle.js'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    express: {
      dev: {
        options: {
          options: 'server.js',
          background: true
        }
      }
    },

    watch: {
      angulartest: {
        files: ['app/js/**/*.js', 'app/index.html', 'app/views/**/*.html'],
        tasks: ['browserify:angulartest', 'karma:unit'],
        options: {
          spawn: false
        }
      },
      express: {
        files: ['app/js/**/*.js', 'app/index.html', 'app/views/**/*.html', 'server.js', 'models/*.js', 'routes/*.js'],
        tasks: ['buildtest', 'express:dev'],
        options: {
          spawn: false
        }
      }
    },
  });

  // register tasks
  grunt.registerTask('default', ['jshint', 'jscs','clean:dev', 'copy:dev']);

  grunt.registerTask('build:dev', ['clean:dev', 'browserify:dev','copy:dev']);

  grunt.registerTask('watch:dev', ['build:dev','express:dev', 'watch:express']);

  // grunt.registerTask('style', ['jshint','jscs']);
  // grunt.registerTask('build:dev', ['clean:dev', 'browserify:dev', 'copy:dev']);
  // grunt.registerTask('angulartest', ['browserify:angulartest', 'karma:unit']);
  // grunt.registerTask('angulartestwatch', ['angulartest', 'watch:angulartest']);
  // grunt.registerTask('test', ['style', 'angulartest', 'simplemocha']);
  // grunt.registerTask('buildtest', ['test', 'build:dev']);
  // grunt.registerTask('default', ['buildtest', 'watch:express']);
};