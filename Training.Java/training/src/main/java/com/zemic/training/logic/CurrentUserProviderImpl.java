package com.zemic.training.logic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zemic.training.common.CurrentUserProvider;
import com.zemic.training.common.LoginUser;
import com.zemic.training.common.PrincipalHelper;
import com.zemic.training.repository.UserRepository;

import lombok.var;

@Service
public class CurrentUserProviderImpl implements CurrentUserProvider {

    private final UserRepository userRepository;

    @Autowired
    public CurrentUserProviderImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public LoginUser getCurrentUser() {
        var loginUser = getLoginUserUUID();
        return loginUser;
    }
    
    private LoginUser getLoginUserUUID() {
        var token = PrincipalHelper.getAuthUserId();

        var user=userRepository.getByAuthenticationToken(token);
        var loginUser=new LoginUser();
        
        loginUser.setId(user.getId());
        loginUser.setName(user.getName());
        
        return loginUser;
    }
}
