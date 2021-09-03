package com.zemic.training.common;

import org.springframework.security.core.context.SecurityContextHolder;


public class PrincipalHelper {
    private static String getOAuthPrincipal(){
        return (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static String getAuthUserId(){
        String token=getOAuthPrincipal();
        return token;
    }
}
