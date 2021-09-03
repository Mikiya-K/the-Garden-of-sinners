package com.zemic.training.logic.commands.marketing;

import java.util.UUID;

import lombok.Data;

@Data
public class UpdateCommand {
    private UUID id;
	private String name;
	private String type;
	private String status;
	private String manager;
}
