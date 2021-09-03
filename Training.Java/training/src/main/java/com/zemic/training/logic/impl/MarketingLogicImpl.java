package com.zemic.training.logic.impl;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zemic.training.common.DateFormatHelper;
import com.zemic.training.common.TimeProvider;
import com.zemic.training.common.UUIDProvider;
import com.zemic.training.entity.Marketing;
import com.zemic.training.logic.MarketingLogic;
import com.zemic.training.logic.commands.marketing.*;

import com.zemic.training.logic.viewModels.*;
import com.zemic.training.repository.MarketingRepository;

import lombok.var;

@Service
public class MarketingLogicImpl implements MarketingLogic {
	private MarketingRepository marketingRepository;
    private TimeProvider timeProvider;
    private UUIDProvider uuidProvider;
	
    public MarketingLogicImpl(MarketingRepository marketingRepository,TimeProvider timeProvider,UUIDProvider uuidProvider) {
        this.marketingRepository=marketingRepository;
        this.timeProvider=timeProvider;
        this.uuidProvider=uuidProvider;
    }
    
	@Override
	public MarketingPaginationViewModel GetByPage(String name,String type,String status,String manager,int currentPage,int pageSize)
	{
		var entities=marketingRepository.getByPage(name,type,status,manager,(currentPage-1)*pageSize+1,currentPage*pageSize);
		
		var viewModels = new ArrayList<MarketingRowViewModel>();
		
		for(Marketing entity:entities)
		{
			var viewModel = new MarketingRowViewModel();
			
            viewModel.setId(entity.getId().toString());
            viewModel.setName(entity.getName());
            viewModel.setType(entity.getType());
            viewModel.setStatus(entity.getStatus());
            viewModel.setManager(entity.getManager());
            viewModel.setEstablishtime(DateFormatHelper.formatToDateTime(entity.getEstablishtime()));
            
            viewModels.add(viewModel);
		}
		
		var total=marketingRepository.queryCountForPage(name,type,status,manager);
		
		return new MarketingPaginationViewModel(viewModels,currentPage,pageSize,total);
	}
	
	@Override
	public MarketingViewModel Get(UUID id)
	{
		var entity=marketingRepository.get(id);
		
		var viewModel=new MarketingViewModel();
		
		viewModel.setId(entity.getId().toString());
		viewModel.setName(entity.getName());
		
		return viewModel;
	}
	
	@Override
    @Transactional
    public void Add(AddCommand command)
    {
		var entity=new Marketing();
		
		entity.setId(uuidProvider.newUUID().toString());
		entity.setName(command.getName());
		entity.setType(command.getType());
		entity.setStatus(command.getStatus());
		entity.setManager(command.getManager());
		entity.setEstablishtime(timeProvider.currentTime());
        entity.setCreatedTime(timeProvider.currentTime());
        entity.setIsDeleted(false);
        
        marketingRepository.add(entity);
    }
	
	@Override
	public void Update(UpdateCommand command)
	{
		var entity=marketingRepository.get(command.getId());
		
		entity.setName(command.getName());
		entity.setType(command.getType());
		entity.setStatus(command.getStatus());
		entity.setManager(command.getManager());
		entity.setLastModifiedTime(timeProvider.currentTime());
		
		marketingRepository.update(entity);
	}
	
	@Override
	public void Delete(DeleteCommand command)
	{
		marketingRepository.delete(command.getId());
	}
}
