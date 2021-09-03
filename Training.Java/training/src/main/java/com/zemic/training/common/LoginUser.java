package com.zemic.training.common;

import java.util.UUID;

import lombok.Data;

@Data
public class LoginUser {
    private UUID id;
    private String name;
}
