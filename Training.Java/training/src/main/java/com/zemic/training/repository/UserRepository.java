package com.zemic.training.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.zemic.training.entity.User;

@Repository
public interface UserRepository extends BaseRepository<User> {
    List<User> getByPage(String name, String loginName, Integer startNumber, Integer endNumber);
    int queryCountForPage(String name, String loginName);
    User getByLoginName(String loginName);
    User getByAuthenticationToken(String token);
}
