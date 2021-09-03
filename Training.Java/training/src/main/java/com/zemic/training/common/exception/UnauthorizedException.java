package com.zemic.training.common.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(){
        super(ErrorMessages.Unauthorized);
    }
}