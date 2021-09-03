app.provider("versionTools", function () {
    this.lastBuildTimeStamp="20210903153040";
    this.$get = function () {
	    var lastBuildTimeStamp = this.lastBuildTimeStamp;
        return {
            getLastBuildTimeStamp: function () {
                return lastBuildTimeStamp;
            }
        }
    };
});