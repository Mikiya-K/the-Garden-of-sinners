/// <binding AfterBuild='default' />
module.exports = function (grunt) {

    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    var lastBuildDateString = new Date().Format("yyyyMMddhhmmss");
    grunt.file.write("index.html", grunt.file.read("deploy.html").replace(/<%lastModifyDate%>/g, lastBuildDateString));
    grunt.file.write("scripts/common/versionTools.js", grunt.file.read("scripts/common/versionTools.template").replace(/<%lastModifyDate%>/g, lastBuildDateString));
    
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            options: { force: true },
            all: {
                src: ["dist/training.js",
                    "dist/training.min.js",
                    "dist/common.js",
                    "dist/common.min.js",
                    "dist/training.css",
                    "dist/training.min.css"]
            }
        },
        concat: {
            options: { seperator: ";" },
            training: {
                src: ["scripts/services/*.js", "scripts/controllers/*.js"],
                dest: "dist/training.js"
            },
            common: {
                src: [
                    "scripts/trainingApp.js",
                    "scripts/common/versionTools.js",
                    "scripts/trainingAppConfig.js",
                    "scripts/common/httpProxy.js",
                    "scripts/common/tools.js",
                    "scripts/filters/*.js",
                    "scripts/directives/*.js",
                    "scripts/vendors/menu.js"
                ],
                dest: "dist/common.js"
            },
            css: {
                dest: "dist/training.css",
                src: [
                    "content/bootstrap.css",
                    "content/font-awesome.min.css",
                    "content/font.css",
                    "content/login.css",
                    "content/style.css",
                    "content/right.css",
                    "content/simple-line-icons.css",
                    "content/zTreeStyle.css"
                ]
            }
        },

        uglify: {
            training: {
                dest: "dist/training.min.js",
                src: "dist/training.js"
            },
            common: {
                dest: "dist/common.min.js",
                src: "dist/common.js"
            },
        }
    });
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["clean", "concat", "uglify"]);
}