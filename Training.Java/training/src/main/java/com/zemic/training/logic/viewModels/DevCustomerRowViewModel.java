package com.zemic.training.logic.viewModels;

import lombok.Data;

@Data
public class DevCustomerRowViewModel {
	private String id;
	private String name;
	private String type;
	private String status;
	private String email;
	private String phone;
	private String manager;
	private String createdTime;
}
