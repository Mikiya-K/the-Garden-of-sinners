package com.zemic.training.logic.viewModels;

import java.util.List;

import com.zemic.training.common.PaginationViewModel;

public class DevCustomerPaginationViewModel extends PaginationViewModel<DevCustomerRowViewModel> {
    public DevCustomerPaginationViewModel(List<DevCustomerRowViewModel> list, int currentPage, int pageSize, int total){
        super(list, currentPage, pageSize, total);
    }
}