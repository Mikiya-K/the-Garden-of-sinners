package com.zemic.training.logic;

import java.util.UUID;

import com.zemic.training.logic.commands.marketing.*;
import com.zemic.training.logic.viewModels.*;

public interface MarketingLogic {
	MarketingPaginationViewModel GetByPage(String name,String type,String status,String manager,int currentPage,int pageSize);
	MarketingViewModel Get(UUID id);
    void Add(AddCommand command);
    void Update(UpdateCommand command);
    void Delete(DeleteCommand command);
}
