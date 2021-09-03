package com.zemic.training.common.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(){
        super(ErrorMessages.NotFound);
    }
}
