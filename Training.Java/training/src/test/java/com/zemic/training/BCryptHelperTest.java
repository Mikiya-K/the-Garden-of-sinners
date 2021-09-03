package com.zemic.training;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import org.junit.Assert;
import org.junit.Test;

import lombok.var;
import com.zemic.training.common.BCryptHelper;

public class BCryptHelperTest {

    @Test
    public void checkHash_should_return_false_when_password_is_not_correct() throws NoSuchAlgorithmException, InvalidKeySpecException {
        var passwordFromZOS = "$2a$05$3b7BN2ffIjROcHr/9oktdew74USOJtcd3iSSOzVEIXutNwfD4Tolu";
        var result = BCryptHelper.checkHash("12345", passwordFromZOS);
        Assert.assertEquals(false, result);
    }
    @Test
    public void checkHash_should_return_true_when_password_is_correct() throws NoSuchAlgorithmException, InvalidKeySpecException {
        var passwordFromZOS = "$2a$05$3b7BN2ffIjROcHr/9oktdew74USOJtcd3iSSOzVEIXutNwfD4Tolu";
        var result = BCryptHelper.checkHash("123456", passwordFromZOS);
        Assert.assertEquals(true, result);
    }
}
