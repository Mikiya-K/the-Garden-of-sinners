package com.zemic.training.logic.commands.devcustomer;

import lombok.Data;

@Data
public class AddCommand {
	private String name;
	private String type;
	private String status;
	private String email;
	private String phone;
	private String manager;
}
