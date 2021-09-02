app.provider("versionTools", function () {
    this.lastBuildTimeStamp="20210902091716";
    this.$get = function () {
	    var lastBuildTimeStamp = this.lastBuildTimeStamp;
        return {
            getLastBuildTimeStamp: function () {
                return lastBuildTimeStamp;
            }
        }
    };
});