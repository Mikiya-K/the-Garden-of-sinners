package com.zemic.training.entity;

import java.util.Date;
import java.util.UUID;

import lombok.Data;

@Data
public class Entity {
     private UUID id;
     private Date createdTime;
     private Date lastModifiedTime;
     private Boolean isDeleted;
     
     public void setId(String id) {
         this.id = UUID.fromString(id);
     }
}
