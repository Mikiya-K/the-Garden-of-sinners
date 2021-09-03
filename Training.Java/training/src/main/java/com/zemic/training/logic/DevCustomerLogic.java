package com.zemic.training.logic;

import java.util.UUID;

import com.zemic.training.logic.commands.devcustomer.*;
import com.zemic.training.logic.viewModels.*;

public interface DevCustomerLogic {
	DevCustomerPaginationViewModel GetByPage(String name,String type,String status,String manager,int currentPage,int pageSize);
	DevCustomerViewModel Get(UUID id);
    void Add(AddCommand command);
    void Update(UpdateCommand command);
    void Delete(DeleteCommand command);
}
