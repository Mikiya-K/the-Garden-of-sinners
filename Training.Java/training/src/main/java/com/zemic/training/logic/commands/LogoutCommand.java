package com.zemic.training.logic.commands;

import lombok.Data;

@Data
public class LogoutCommand {
    private String authenticationToken;
}
