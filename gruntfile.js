'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		//serverViews: ['app/views/**/*.*'],
		//serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		clientViews: ['views/*.html'],
		clientJS: ['js/*.js'],
		clientCSS: ['css/*.css'],
		mochaTests: ['tests/**/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
		    styles: {
		        files: ['css/*.less'], // which files to watch
		        tasks: ['less'],
		        options: {
		            livereload: true
		        }
		    },
			//serverViews: {
			//	files: watchFiles.serverViews,
			//	options: {
			//		livereload: true
			//	}
			//},
			//serverJS: {
			//	files: watchFiles.serverJS,
			//	tasks: ['jshint'],
			//	options: {
			//		livereload: true
			//	}
			//},
			//clientViews: {
			//	files: watchFiles.clientViews,
			//	options: {
			//		livereload: true,
			//	}
			//},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'js/main.js': 'js/main.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					//'main.css': '<%= applicationCSSFiles %>'
					'css/main.css': 'css/main.css'
				}
			}
		},
		//nodemon: {
		//	dev: {
		//		script: 'server.js',
		//		options: {
		//			nodeArgs: ['--debug'],
		//			ext: 'js,html',
		//			watch: watchFiles.serverViews.concat(watchFiles.serverJS)
		//		}
		//	}
		//},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		ngAnnotate: {
			production: {
				files: {
					//'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			secure: {
				NODE_ENV: 'secure'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		less: {
		    development: {
		        options: {
		           // compress: true,
		         //   yuicompress: true,
		           // optimization: 2
		        },
		        files: {
		            "css/main.css": "css/main.less" // destination file and source file
		        }
		    }
		},
	});
    //Less
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.registerTask('default', ['less', 'watch']);
	grunt.loadNpmTasks('grunt-contrib-watch');
	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);
	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Secure task(s).
	grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'uglify', 'cssmin']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};