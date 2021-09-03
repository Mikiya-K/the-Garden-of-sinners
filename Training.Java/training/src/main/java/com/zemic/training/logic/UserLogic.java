package com.zemic.training.logic;

import java.util.UUID;

import com.zemic.training.logic.commands.user.*;
import com.zemic.training.logic.viewModels.*;

public interface UserLogic {
    UserPaginationViewModel GetByPage(String name, String loginName, int currentPage, int pageSize);
    UserViewModel Get(UUID id);
    void Add(AddCommand command);
    void Update(UpdateCommand command);
    void Delete(DeleteCommand command);
}
