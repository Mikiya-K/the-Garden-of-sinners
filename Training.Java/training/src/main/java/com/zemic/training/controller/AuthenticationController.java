package com.zemic.training.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.zemic.training.logic.AuthenticationLogic;
import com.zemic.training.logic.commands.*;
import com.zemic.training.logic.viewModels.AuthenticationViewModel;

@RestController
@RequestMapping("/api")
public class AuthenticationController {
    private final AuthenticationLogic authenticationLogic;
    
    @Autowired
    public AuthenticationController(AuthenticationLogic authenticationLogic) {
        this.authenticationLogic = authenticationLogic;
    }
    
    @PostMapping("/login")
    public AuthenticationViewModel login(@RequestBody @Valid LoginCommand command) {
        return authenticationLogic.login(command);
    }
    
    @PostMapping("/logout")
    public void logout(@RequestBody @Valid LogoutCommand command) {
        authenticationLogic.logout(command);
    }
    
    @PostMapping("/verification")
    public AuthenticationViewModel verification(@RequestBody @Valid VerificationCommand command) {
        return authenticationLogic.validateAuth(command);
    }
    
    @PostMapping("/changePassword")
    public void changePassword(@RequestBody @Valid ChangePasswordCommand command) {
        authenticationLogic.changePassword(command);
    }

}
