package com.zemic.training.common;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

import lombok.var;

public class SimpleTokenHeaderFilter extends AbstractPreAuthenticatedProcessingFilter {

    private String authHeaderName;

    public SimpleTokenHeaderFilter(String authHeaderName) {
        this.authHeaderName = authHeaderName;
    }

    @Override
    protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
        var authHeaderToken=request.getHeader(authHeaderName);
        if(authHeaderToken==null)
        {
            authHeaderToken = request.getParameter(authHeaderName);
        }
        return authHeaderToken;
    }

    @Override
    protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
        return "N/A";
    }
}
