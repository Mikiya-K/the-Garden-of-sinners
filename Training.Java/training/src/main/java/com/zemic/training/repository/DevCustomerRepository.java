package com.zemic.training.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.zemic.training.entity.DevCustomer;

@Repository
public interface DevCustomerRepository extends BaseRepository<DevCustomer> {
    List<DevCustomer> getByPage(String name,String type,String status,String manager,Integer startNumber,Integer endNumber);
    int queryCountForPage(String name,String type,String status,String manager);

}
