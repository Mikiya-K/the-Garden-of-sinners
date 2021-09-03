package com.zemic.training.common;

public interface Logger {
    void error(String message, Throwable error);
    void info(String message);
}
