package com.zemic.training.common.exception;

public class CommonException extends RuntimeException{
    public CommonException(String message){
        super(message);
    }
    public CommonException(String message,Exception e){
        super(message,e);
    }
}
