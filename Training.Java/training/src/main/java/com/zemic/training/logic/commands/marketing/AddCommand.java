package com.zemic.training.logic.commands.marketing;

import lombok.Data;

@Data
public class AddCommand {
	private String name;
	private String type;
	private String status;
	private String manager;
}
