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

import com.zemic.training.logic.MarketingLogic;
import com.zemic.training.logic.commands.marketing.*;
import com.zemic.training.logic.viewModels.MarketingPaginationViewModel;
import com.zemic.training.logic.viewModels.MarketingViewModel;

import lombok.var;

@RestController
public class MarketingController {
	private final MarketingLogic marketingLogic;
	
	@Autowired
	public MarketingController(MarketingLogic marketingLogic) {
		this.marketingLogic=marketingLogic;
	}
	
	@GetMapping("/api/marketing/pagination")
	public MarketingPaginationViewModel getByPage(String name,String type,String status,String manager,int currentPage,int pageSize) {
		return marketingLogic.GetByPage(name,type,status,manager,currentPage,pageSize);
	}
	
    @GetMapping("/api/marketing/{id}")
    public MarketingViewModel getById(@PathVariable("id") UUID id) {
       return marketingLogic.Get(id);
    }
    
    @PostMapping("/api/marketing")
    public void add(@RequestBody @Valid AddCommand command) {
    	marketingLogic.Add(command);
    }
    
    @PutMapping("/api/marketing/{id}")
    public void update(@PathVariable("id")UUID id,@RequestBody @Valid UpdateCommand command) {
    	marketingLogic.Update(command);
    }
    
    @DeleteMapping("/api/marketing/{id}")
    public void delete(@PathVariable("id") UUID id) {
       var command=new DeleteCommand();
       command.setId(id);
       marketingLogic.Delete(command);
    }
}
