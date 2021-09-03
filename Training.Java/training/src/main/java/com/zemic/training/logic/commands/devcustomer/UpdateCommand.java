package com.zemic.training.logic.commands.devcustomer;

import java.util.UUID;

import lombok.Data;

@Data
public class UpdateCommand {
	private UUID id;
	private String name;
	private String type;
	private String status;
	private String email;
	private String phone;
	private String manager;
}
