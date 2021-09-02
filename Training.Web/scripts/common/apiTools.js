app.provider("apiTools", function () {
    this.apiUrl = "http://localhost:51347/api/";

    this.$get = function () {
        var apiUrl = this.apiUrl;
        return {
            getApiUrl: function () {
                return apiUrl;
            }
        }
    };
});


