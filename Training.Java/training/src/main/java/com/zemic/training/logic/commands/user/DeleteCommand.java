package com.zemic.training.logic.commands.user;

import java.util.UUID;

import lombok.Data;

@Data
public class DeleteCommand {
    private UUID id;
}
