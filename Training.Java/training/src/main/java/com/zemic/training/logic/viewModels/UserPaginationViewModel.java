package com.zemic.training.logic.viewModels;

import java.util.List;

import com.zemic.training.common.PaginationViewModel;

public class UserPaginationViewModel extends PaginationViewModel<UserRowViewModel> {
    public UserPaginationViewModel(List<UserRowViewModel> list, int currentPage, int pageSize, int total){
        super(list, currentPage, pageSize, total);
    }
}
