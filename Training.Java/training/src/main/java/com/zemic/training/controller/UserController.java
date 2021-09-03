package com.zemic.training.controller;

import java.util.UUID;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.zemic.training.logic.UserLogic;
import com.zemic.training.logic.commands.user.*;
import com.zemic.training.logic.viewModels.*;

import lombok.var;

@RestController
public class UserController {

    private final UserLogic userLogic;
    
    @Autowired
    public UserController(UserLogic userLogic) {
        this.userLogic = userLogic;
    }
    
    @GetMapping("/api/users/pagination")
    public UserPaginationViewModel getByPage(String name, String loginName, int currentPage, int pageSize) {
       return userLogic.GetByPage(name,loginName,currentPage,pageSize);
    }
    
    @GetMapping("/api/users/{id}")
    public UserViewModel getById(@PathVariable("id") UUID id) {
       return userLogic.Get(id);
    }
    
    @PostMapping("/api/users")
    public void add(@RequestBody @Valid AddCommand command) {
       userLogic.Add(command);
    }
    
    @PutMapping("/api/users/{id}")
    public void update(@PathVariable("id")UUID id,@RequestBody @Valid UpdateCommand command) {
       userLogic.Update(command);
    }
    
    @DeleteMapping("/api/users/{id}")
    public void update(@PathVariable("id") UUID id) {
       var command=new DeleteCommand();
       command.setId(id);
       userLogic.Delete(command);
    }
}
