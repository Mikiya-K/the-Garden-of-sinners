package com.zemic.training.logic.commands;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.zemic.training.logic.ErrorMessages;

@Data
public class ChangePasswordCommand {
    @NotNull(message = ErrorMessages.AuthenticationTokenCanNotNull)
    private String authenticationToken;
    
    @NotNull(message = ErrorMessages.OldPasswordCanNotNull)
    @Size(min = 1, max = 100, message = ErrorMessages.OldPasswordIsTooLong)
    private String oldPassword;
    
    @NotNull(message = ErrorMessages.NewPasswordCanNotNull)
    @Size(min = 1, max = 100, message = ErrorMessages.NewPasswordIsTooLong)
    private String newPassword;
    
    @NotNull(message = ErrorMessages.ConfirmPasswordCanNotNull)
    private String confirmPassword;
}
