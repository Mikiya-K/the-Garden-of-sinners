package com.zemic.training.common;

import java.util.Date;

import org.springframework.stereotype.Service;

@Service
public class TimeProviderImpl implements TimeProvider{

    @Override
    public Date currentTime() {
        return new Date(System.currentTimeMillis());
    }
}
