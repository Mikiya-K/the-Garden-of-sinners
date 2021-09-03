package com.zemic.training.repository;

import java.util.UUID;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BaseRepository<T> {
    void add(T model);
    void update(T model);
    void delete(@Param("id") UUID id);
    T get(@Param("id") UUID id);
}
