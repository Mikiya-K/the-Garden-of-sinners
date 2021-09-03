package com.zemic.training.common;

import lombok.Data;

@Data
public class Pagination {
    private int currentPage;
    private int pageSize;
    private int total;

    public Pagination(int currentPage, int pageSize, int total) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.total = total;
    }
}
