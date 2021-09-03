package com.zemic.training.common;

import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.zemic.training.common.exception.CommonException;
import com.zemic.training.common.exception.ErrorMessages;
import com.zemic.training.common.exception.ForbiddenException;
import com.zemic.training.common.exception.LogicException;
import com.zemic.training.common.exception.NotFoundException;
import com.zemic.training.common.exception.UnauthorizedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
public class ExceptionHandlerAdvice {

    @Autowired
    private Logger logger;

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<List<String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        return error(INTERNAL_SERVER_ERROR, e);
    }


    @ExceptionHandler({CommonException.class})
    public ResponseEntity<String> handleDogsServiceException(CommonException e){
        return handleKnowError(INTERNAL_SERVER_ERROR, e);
    }

    @ExceptionHandler({ForbiddenException.class})
    public ResponseEntity<String> handleForbiddenException(ForbiddenException e) {
        return handleKnowError(FORBIDDEN, e);
    }
    
    @ExceptionHandler({UnauthorizedException.class})
    public ResponseEntity<String> handleUnauthorizedException(UnauthorizedException e) {
        return handleKnowError(UNAUTHORIZED, e);
    }

    @ExceptionHandler({NotFoundException.class})
    public ResponseEntity<String> handleNotFoundException(NotFoundException e) {
        return handleKnowError(NOT_FOUND, e);
    }

    @ExceptionHandler({LogicException.class})
    public ResponseEntity<String> handleDogsServiceException(LogicException e){
        return handleKnowError(INTERNAL_SERVER_ERROR, e);
    }

    @ExceptionHandler({RuntimeException.class})
    public ResponseEntity<String> handleRunTimeException(RuntimeException e) {
        return unhandledError(INTERNAL_SERVER_ERROR, e);
    }

    private ResponseEntity<String> handleKnowError(HttpStatus status, Exception e) {
        logger.error("Exception : ", e);
        CustomErrorResponse errors = new CustomErrorResponse();
        errors.setTimestamp(LocalDateTime.now());
        errors.setMessage(e.getMessage());
        errors.setStatus(status.value());
        return new ResponseEntity(errors,HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<List<String>> error(HttpStatus status, MethodArgumentNotValidException e) {
        logger.error("Exception : ", e);
        CustomErrorResponse errors = new CustomErrorResponse();
        errors.setTimestamp(LocalDateTime.now());
        var validErrors=e.getBindingResult()
                .getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.joining(";"));
        errors.setMessage(validErrors);
        errors.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity(errors,HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<String> unhandledError(HttpStatus status, RuntimeException e) {
        logger.error("Exception : ", e);
        CustomErrorResponse errors = new CustomErrorResponse();
        errors.setTimestamp(LocalDateTime.now());
        errors.setMessage(ErrorMessages.InternalServerError);
        errors.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity(errors,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
