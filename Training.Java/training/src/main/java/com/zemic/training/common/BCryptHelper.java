package com.zemic.training.common;

public class BCryptHelper {
    private static String getSalt(){
        String salt = BCrypt.gensalt(5);
        return salt;
    }

    public static String getHash(String passwordToHash){
        String hashedPassword = BCrypt.hashpw(passwordToHash, getSalt());
        return hashedPassword;
    }

    public static boolean checkHash(String password, String hash){
        return BCrypt.checkpw(password,hash);
    }
}
