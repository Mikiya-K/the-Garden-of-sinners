package com.zemic.training.logic.commands.user;

import java.util.UUID;

import lombok.Data;

@Data
public class UpdateCommand {
    private UUID id;
    private String name;
    private String loginName;
}
