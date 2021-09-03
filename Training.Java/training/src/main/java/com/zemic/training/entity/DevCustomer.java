package com.zemic.training.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class DevCustomer extends Entity {
	private String name;
	private String type;
	private String status;
	private String email;
	private String phone;
	private String manager;
}
