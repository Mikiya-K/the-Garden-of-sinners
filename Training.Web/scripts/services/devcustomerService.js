app.service("devcustomerService", ["httpProxy",
    function (httpProxy) {
        var services = {};
        
        services.getByPage = function (params) {
            return httpProxy.get("devcustomer/pagination?" + jQuery.param(params));
        };
        services.add = function (command) {
            return httpProxy.post("devcustomer", command);
        };
        services.edit = function (id, command) {
            return httpProxy.put("devcustomer/" + id, command);
        };
        services.delete = function (id) {
            return httpProxy.delete("devcustomer/" + id);
        };

        return services;
    }]);