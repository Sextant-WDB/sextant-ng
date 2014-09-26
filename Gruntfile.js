'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-browserify');

  var allJavaScriptFilePaths = [
    'app/js/**/*.js',
    'app/controllers/**/*.js',
    'app/services/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'lib/**/*.js',
    'server.js'
  ];

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
        src: [
          '*.html',
          'css/*.css',
          'views/**/*.html',
          'public/**/*.*',
          'templates/**/*.html',
          'images/**/*.*'],
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
        src: [
          'app/js/**/*.js',
          'app/app.js'
        ],
        dest: 'build/scripts.js'
      }
    },

    sass: {
      build: {
        files: {
          'app/css/styles.css': 'app/css/scss/styles.scss'
        }
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
          script: 'server.js',
          background: true
        }
      }
    },

    watch: {
      angulartest: {
        files: [
          'app/js/**/*.js',
          'app/index.html',
          'app/views/**/*.html',
          'app/views/*.html',
          'app/css/scss/*'
        ],
        tasks: [
          'browserify:angulartest',
          'karma:unit'
        ],
        options: {
          spawn: false
        }
      },
      express: {
        files: [
          'app/js/**/*.js',
          'app/index.html',
          'app/views/**/*.html',
          'app/css/scss/*.scss',
          'server.js',
          'models/*.js',
          'routes/*.js',
          'images/**.*'
        ],
        tasks: [
          'jshint',
          'jscs',
          'sass',
          'clean:dev',
          'browserify:dev',
          'copy:dev',
          'express:dev',
          'watch:express'
        ],
        options: {
          spawn: false
        }
      }
    },
  });

  // register tasks
  grunt.registerTask('default', [
      'jshint',
      'jscs',
      'sass',
      'clean:dev',
      'browserify:dev',
      'copy:dev',
      'express:dev',
      'watch:express'
    ]);

  grunt.registerTask('build:dev', [
      'clean:dev',
      'browserify:dev',
      'copy:dev'
    ]);

  grunt.registerTask('watch:dev', [
      'build:dev',
      'express:dev',
      'watch:express'
    ]);

};