package com.zemic.training.logic.commands;

import lombok.Data;

@Data
public class LoginCommand {
    private String loginName;
    private String password;
}
