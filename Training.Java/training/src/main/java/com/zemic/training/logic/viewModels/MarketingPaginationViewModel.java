package com.zemic.training.logic.viewModels;

import java.util.List;

import com.zemic.training.common.PaginationViewModel;

public class MarketingPaginationViewModel extends PaginationViewModel<MarketingRowViewModel> {
    public MarketingPaginationViewModel(List<MarketingRowViewModel> list, int currentPage, int pageSize, int total){
        super(list, currentPage, pageSize, total);
    }
}
