package com.zemic.training.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.zemic.training.entity.Marketing;

@Repository
public interface MarketingRepository extends BaseRepository<Marketing> {
    List<Marketing> getByPage(String name,String type,String status,String manager,Integer startNumber,Integer endNumber);
    int queryCountForPage(String name,String type,String status,String manager);


}
