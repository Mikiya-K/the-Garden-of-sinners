package com.zemic.training.logic.impl;

import lombok.var;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zemic.training.common.BCryptHelper;
import com.zemic.training.common.DateFormatHelper;
import com.zemic.training.common.TimeProvider;
import com.zemic.training.common.UUIDProvider;
import com.zemic.training.entity.User;
import com.zemic.training.logic.UserLogic;
import com.zemic.training.logic.commands.user.AddCommand;
import com.zemic.training.logic.commands.user.DeleteCommand;
import com.zemic.training.logic.commands.user.UpdateCommand;
import com.zemic.training.logic.viewModels.UserPaginationViewModel;
import com.zemic.training.logic.viewModels.UserRowViewModel;
import com.zemic.training.logic.viewModels.UserViewModel;
import com.zemic.training.repository.UserRepository;

@Service
public class UserLogicImpl implements UserLogic{

    private UserRepository userRepository;
    private TimeProvider timeProvider;
    private UUIDProvider uuidProvider;
    private final String defaultPassword = "123456";

    public UserLogicImpl(UserRepository userRepository,
            TimeProvider timeProvider,
            UUIDProvider uuidProvider) {
        this.userRepository = userRepository;
        this.timeProvider=timeProvider;
        this.uuidProvider=uuidProvider;
    }
    
    @Override
    public UserPaginationViewModel GetByPage(String name, String loginName, int currentPage,int pageSize) {
        var entities=userRepository.getByPage(name, loginName,
                (currentPage - 1) * pageSize + 1, currentPage * pageSize);
        
        var viewModels = new ArrayList<UserRowViewModel>();
        
        for (User entity : entities) {
            var viewModel = new UserRowViewModel();
            viewModel.setId(entity.getId().toString());
            viewModel.setName(entity.getName());
            viewModel.setLoginName(entity.getLoginName());
            viewModel.setLastLoginTime(DateFormatHelper.formatToDateTime(entity.getLastLoginTime()));
            viewModels.add(viewModel);
        }
        
        var total=userRepository.queryCountForPage(name, loginName);
        return new UserPaginationViewModel(viewModels,  currentPage, pageSize, total); 
    }

    @Override
    public UserViewModel Get(UUID id) {
        var entity=userRepository.get(id);
        
        var viewModel=new UserViewModel();
        
        viewModel.setId(entity.getId().toString());
        viewModel.setName(entity.getName());
        viewModel.setLoginName(entity.getLoginName());
        
        return viewModel;
    }

    @Override
    @Transactional
    public void Add(AddCommand command) {
        var entity=new User();
        
        entity.setId(uuidProvider.newUUID().toString());
        entity.setName(command.getName());
        entity.setLoginName(command.getLoginName());
        entity.setPassword(BCryptHelper.getHash(defaultPassword));
        entity.setCreatedTime(timeProvider.currentTime());
        entity.setIsDeleted(false);
        
        userRepository.add(entity);
    }

    @Override
    public void Update(UpdateCommand command) {
        var entity=userRepository.get(command.getId());
        entity.setName(command.getName());
        entity.setLoginName(command.getLoginName());
        entity.setLastModifiedTime(timeProvider.currentTime());
        userRepository.update(entity);
    }

    @Override
    public void Delete(DeleteCommand command) {
        userRepository.delete(command.getId());
    }
}
