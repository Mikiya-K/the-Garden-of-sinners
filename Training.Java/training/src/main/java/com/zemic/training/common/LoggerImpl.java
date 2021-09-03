package com.zemic.training.common;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class LoggerImpl  implements com.zemic.training.common.Logger {
    private static final Logger logger = LogManager.getLogger(LoggerImpl.class);

    public void error(String message,Throwable error){
        logger.error(message,error);
    }

    public void info(String message){
        logger.info(message);
    }
}
