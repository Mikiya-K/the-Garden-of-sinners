app.provider("versionTools", function () {
    this.lastBuildTimeStamp="20210903084630";
    this.$get = function () {
	    var lastBuildTimeStamp = this.lastBuildTimeStamp;
        return {
            getLastBuildTimeStamp: function () {
                return lastBuildTimeStamp;
            }
        }
    };
});