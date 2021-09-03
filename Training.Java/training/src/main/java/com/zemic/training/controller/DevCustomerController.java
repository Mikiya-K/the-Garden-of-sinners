package com.zemic.training.controller;

import java.util.UUID;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zemic.training.logic.DevCustomerLogic;
import com.zemic.training.logic.commands.devcustomer.*;
import com.zemic.training.logic.viewModels.DevCustomerPaginationViewModel;
import com.zemic.training.logic.viewModels.DevCustomerViewModel;

import lombok.var;

@RestController
public class DevCustomerController {
	private final DevCustomerLogic devCustomerLogic;
	
	@Autowired
	public DevCustomerController(DevCustomerLogic devCustomerLogic) {
		this.devCustomerLogic=devCustomerLogic;
	}
	
	@GetMapping("/api/devcustomer/pagination")
	public DevCustomerPaginationViewModel getByPage(String name,String type,String status,String manager,int currentPage,int pageSize) {
		return devCustomerLogic.GetByPage(name,type,status,manager,currentPage,pageSize);
	}
	
    @GetMapping("/api/devcustomer/{id}")
    public DevCustomerViewModel getById(@PathVariable("id") UUID id) {
       return devCustomerLogic.Get(id);
    }
    
    @PostMapping("/api/devcustomer")
    public void add(@RequestBody @Valid AddCommand command) {
    	devCustomerLogic.Add(command);
    }
    
    @PutMapping("/api/devcustomer/{id}")
    public void update(@PathVariable("id")UUID id,@RequestBody @Valid UpdateCommand command) {
    	devCustomerLogic.Update(command);
    }
    
    @DeleteMapping("/api/devcustomer/{id}")
    public void delete(@PathVariable("id") UUID id) {
       var command=new DeleteCommand();
       command.setId(id);
       devCustomerLogic.Delete(command);
    }
}
