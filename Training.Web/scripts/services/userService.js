app.service("userService", ["httpProxy",
    function (httpProxy) {
        var services = {};
        
        services.getByPage = function (params) {
            return httpProxy.get("users/pagination?" + jQuery.param(params));
        };
        services.add = function (command) {
            return httpProxy.post("users", command);
        };
        services.edit = function (id, command) {
            return httpProxy.put("users/" + id, command);
        };
        services.delete = function (id) {
            return httpProxy.delete("users/" + id);
        };

        return services;
    }]);