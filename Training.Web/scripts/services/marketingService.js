app.service("marketingService", ["httpProxy",
    function (httpProxy) {
        var services = {};
        
        services.getByPage = function (params) {
            return httpProxy.get("marketing/pagination?" + jQuery.param(params));
        };
        services.add = function (command) {
            return httpProxy.post("marketing", command);
        };
        services.edit = function (id, command) {
            return httpProxy.put("marketing/" + id, command);
        };
        services.delete = function (id) {
            return httpProxy.delete("marketing/" + id);
        };

        return services;
    }]);