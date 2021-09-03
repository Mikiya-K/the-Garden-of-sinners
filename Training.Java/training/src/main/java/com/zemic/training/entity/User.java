package com.zemic.training.entity;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class User extends Entity  {
    private String name;
    private String loginName;
    private String password;
    private String authenticationToken;
    private Date lastLoginTime;
}
