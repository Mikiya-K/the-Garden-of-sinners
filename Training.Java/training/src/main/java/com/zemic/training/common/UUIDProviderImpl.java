package com.zemic.training.common;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class UUIDProviderImpl implements UUIDProvider{

    @Override
    public UUID newUUID() {
        // TODO Auto-generated method stub
        return UUID.randomUUID();
    }

}
