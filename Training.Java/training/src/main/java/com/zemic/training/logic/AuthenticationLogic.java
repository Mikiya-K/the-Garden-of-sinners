package com.zemic.training.logic;

import com.zemic.training.logic.commands.*;
import com.zemic.training.logic.viewModels.AuthenticationViewModel;

/*
 * 认证业务逻辑
 */
public interface AuthenticationLogic {
    /*
     * 登录
     */
    AuthenticationViewModel login(LoginCommand command);
    /*
     * 退出登录
     */
    void logout(LogoutCommand command);
    /*
     * 修改密码
     */
    void changePassword(ChangePasswordCommand command);
    /*
     * 验证Token
     */
    AuthenticationViewModel validateAuth(VerificationCommand token);
}
