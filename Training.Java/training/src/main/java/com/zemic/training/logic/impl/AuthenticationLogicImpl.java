package com.zemic.training.logic.impl;

import org.springframework.stereotype.Service;

import com.zemic.training.common.BCryptHelper;
import com.zemic.training.common.StringHelper;
import com.zemic.training.common.TimeProvider;
import com.zemic.training.common.UUIDProvider;
import com.zemic.training.common.exception.ErrorMessages;
import com.zemic.training.common.exception.LogicException;
import com.zemic.training.common.exception.UnauthorizedException;
import com.zemic.training.logic.AuthenticationLogic;
import com.zemic.training.logic.commands.ChangePasswordCommand;
import com.zemic.training.logic.commands.LoginCommand;
import com.zemic.training.logic.commands.LogoutCommand;
import com.zemic.training.logic.commands.VerificationCommand;
import com.zemic.training.logic.viewModels.AuthenticationViewModel;
import com.zemic.training.repository.UserRepository;

import lombok.var;

/*
 * 认证业务逻辑实现
 */
@Service
public class AuthenticationLogicImpl implements AuthenticationLogic {

    private UserRepository userRepository;
    private TimeProvider timeProvider;
    private UUIDProvider uuidProvider;

    public AuthenticationLogicImpl(UserRepository userRepository,
            TimeProvider timeProvider,
            UUIDProvider uuidProvider) {
        this.userRepository = userRepository;
        this.timeProvider=timeProvider;
        this.uuidProvider=uuidProvider;
    }
    
    @Override
    public AuthenticationViewModel login(LoginCommand command) {
        if (StringHelper.IsNullOrEmpty(command.getLoginName()))
        {
            throw new LogicException(ErrorMessages.LoginNameIsNull);
        }
        if (StringHelper.IsNullOrEmpty(command.getPassword()))
        {
            throw new LogicException(ErrorMessages.PasswordIsNull);
        }

        var user = userRepository.getByLoginName(command.getLoginName());
        if (user == null)
        {
            throw new LogicException(ErrorMessages.LoginNameNotExisted);
        }
        if (!BCryptHelper.checkHash(command.getPassword(), user.getPassword()))
        {
            throw new LogicException(ErrorMessages.LoginFault);
        }
        user.setLastLoginTime(timeProvider.currentTime());
        user.setAuthenticationToken(BCryptHelper.getHash(uuidProvider.newUUID().toString()));
        userRepository.update(user);
        
        var authenticationViewModel=new AuthenticationViewModel();
        
        authenticationViewModel.setUserName(user.getName());
        authenticationViewModel.setAuthenticationToken(user.getAuthenticationToken());
        return authenticationViewModel;
    }

    @Override
    public void logout(LogoutCommand command) {
        if (StringHelper.IsNullOrEmpty(command.getAuthenticationToken()))
        {
            throw new UnauthorizedException();
        }
        var user = userRepository.getByAuthenticationToken(command.getAuthenticationToken());
        if (user == null)
        {
            throw new UnauthorizedException();
        }

        user.setAuthenticationToken(null);
        userRepository.update(user);
    }

    @Override
    public void changePassword(ChangePasswordCommand command) {
        if (StringHelper.IsNullOrEmpty(command.getAuthenticationToken()))
        {
            throw new UnauthorizedException();
        }
        var user = userRepository.getByAuthenticationToken(command.getAuthenticationToken());
        if (user == null)
        {
            throw new UnauthorizedException();
        }

        if (StringHelper.IsNullOrEmpty(command.getOldPassword()))
        {
            throw new LogicException(ErrorMessages.OldPasswordIsNull);
        }
        if (!BCryptHelper.checkHash(command.getOldPassword(), user.getPassword()))
        {
            throw new LogicException(ErrorMessages.OldPasswordIsError);
        }
        if (StringHelper.IsNullOrEmpty(command.getNewPassword()))
        {
            throw new LogicException(ErrorMessages.NewPasswordIsNull);
        }
        if (StringHelper.IsNullOrEmpty(command.getConfirmPassword()))
        {
            throw new LogicException(ErrorMessages.ConfirmPasswordIsNull);
        }
        if (command.getNewPassword() != command.getConfirmPassword())
        {
            throw new LogicException(ErrorMessages.PasswordIsDiff);
        }

        user.setPassword(BCryptHelper.getHash(command.getNewPassword()));
        userRepository.update(user);
        
    }

    @Override
    public AuthenticationViewModel validateAuth(VerificationCommand token) {
        if (StringHelper.IsNullOrEmpty(token.getAuthenticationToken()))
        {
            throw new UnauthorizedException();
        }
        var user = userRepository.getByAuthenticationToken(token.getAuthenticationToken());
        if (user == null)
        {
            throw new UnauthorizedException();
        }

        var authenticationViewModel=new AuthenticationViewModel();
        
        authenticationViewModel.setUserName(user.getName());
        authenticationViewModel.setAuthenticationToken(user.getAuthenticationToken());
        return authenticationViewModel;
    }
}
