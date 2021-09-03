package com.zemic.training.entity;

import java.util.Date;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
public class Marketing extends Entity {
	private String name;
	private String type;
	private String status;
	private String manager;
	private String authenticationToken;
	private Date establishtime;
}
