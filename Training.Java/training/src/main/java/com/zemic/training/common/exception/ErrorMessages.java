package com.zemic.training.common.exception;

public class ErrorMessages {
 // common
    public static final String Unauthorized = "登录无效或已经过期，请重新登录";
    public static final String InternalServerError = "服务器内部错误，请联系管理员";
    public static final String NotFound = "未找到服务";

    // login
    public static final String LoginNameIsNull = "账号不能为空";
    public static final String PasswordIsNull = "密码不能为空";
    public static final String LoginNameNotExisted = "账号不存在";
    public static final String LoginFault = "密码错误";
    
    // change password
    public static final String OldPasswordIsNull = "旧密码不能为空";
    public static final String OldPasswordIsError = "旧密码输入错误";
    public static final String NewPasswordIsNull = "新密码不能为空";
    public static final String ConfirmPasswordIsNull = "确认密码不能为空";
    public static final String PasswordIsDiff = "两次密码输入不一致";

    // user
    public static final String UserNotExisted = "用户信息不存在";
    public static final String UserNameIsNull = "用户姓名不能为空";
    public static final String LoginNameIsExisted = "账号已经存在";
}
