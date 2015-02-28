module.exports = function(grunt){
  grunt.initConfig({
    browserify: {
      options:{
        require: [
                  "./src/scripts/ui/views/view_base.js",
                  "./src/scripts/ui/views/youtube_view.js"
                 ]
      },
      scripts:{
        files:{
          "build/videofxf.js":["src/scripts/videofxf.js"]
        }
      }
    },
    watch:{
      scripts:{
        files: "src/**/**.js",
        tasks: ["browserify"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("default", ["browserify", "watch"]);
}