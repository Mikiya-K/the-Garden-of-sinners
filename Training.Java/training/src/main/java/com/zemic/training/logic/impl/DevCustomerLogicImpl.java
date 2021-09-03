package com.zemic.training.logic.impl;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zemic.training.common.TimeProvider;
import com.zemic.training.common.UUIDProvider;
import com.zemic.training.entity.DevCustomer;
import com.zemic.training.logic.DevCustomerLogic;
import com.zemic.training.logic.commands.devcustomer.*;
import com.zemic.training.logic.viewModels.*;
import com.zemic.training.repository.DevCustomerRepository;

import lombok.var;

@Service
public class DevCustomerLogicImpl implements DevCustomerLogic {
	private DevCustomerRepository devCustomerRepository;
    private TimeProvider timeProvider;
    private UUIDProvider uuidProvider;
	
    public DevCustomerLogicImpl(DevCustomerRepository devCustomerRepository,TimeProvider timeProvider,UUIDProvider uuidProvider) {
        this.devCustomerRepository=devCustomerRepository;
        this.timeProvider=timeProvider;
        this.uuidProvider=uuidProvider;
    }
    
	@Override
	public DevCustomerPaginationViewModel GetByPage(String name,String type,String status,String manager,int currentPage,int pageSize)
	{
		var entities=devCustomerRepository.getByPage(name,type,status,manager,(currentPage-1)*pageSize+1,currentPage*pageSize);
		
		var viewModels = new ArrayList<DevCustomerRowViewModel>();
		
		for(DevCustomer entity:entities)
		{
			var viewModel = new DevCustomerRowViewModel();
			
            viewModel.setId(entity.getId().toString());
            viewModel.setName(entity.getName());
            viewModel.setType(entity.getType());
            viewModel.setStatus(entity.getStatus());
            viewModel.setEmail(entity.getEmail());
            viewModel.setPhone(entity.getPhone());
            viewModel.setManager(entity.getManager());
            viewModel.setCreatedTime(entity.getCreatedTime().toString());
                                  
            viewModels.add(viewModel);
		}
		
		var total=devCustomerRepository.queryCountForPage(name,type,status,manager);
		
		return new DevCustomerPaginationViewModel(viewModels,currentPage,pageSize,total);
	}
	
	@Override
	public DevCustomerViewModel Get(UUID id)
	{
		var entity=devCustomerRepository.get(id);
		
		var viewModel=new DevCustomerViewModel();
		
		viewModel.setId(entity.getId().toString());
		viewModel.setName(entity.getName());
		
		return viewModel;
	}
	
	@Override
    @Transactional
    public void Add(AddCommand command)
    {
		var entity=new DevCustomer();
		
		entity.setId(uuidProvider.newUUID().toString());
		entity.setName(command.getName());
		entity.setType(command.getType());
		entity.setStatus(command.getStatus());
		entity.setEmail(command.getEmail());
		entity.setPhone(command.getPhone());
		entity.setManager(command.getManager());
        entity.setCreatedTime(timeProvider.currentTime());
        entity.setIsDeleted(false);
        
        devCustomerRepository.add(entity);
    }
	
	@Override
	public void Update(UpdateCommand command)
	{
		var entity=devCustomerRepository.get(command.getId());
		
		entity.setName(command.getName());
		entity.setType(command.getType());
		entity.setStatus(command.getStatus());
		entity.setEmail(command.getEmail());
		entity.setPhone(command.getPhone());
		entity.setManager(command.getManager());
		entity.setLastModifiedTime(timeProvider.currentTime());
		
		devCustomerRepository.update(entity);
	}
	
	@Override
	public void Delete(DeleteCommand command)
	{
		devCustomerRepository.delete(command.getId());
	}
}
