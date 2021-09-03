package com.zemic.training.common;

import lombok.var;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateFormatHelper {
    public static String formatToDay(Date date) {
        var dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        if (date == null) {
            return null;
        } else {
            return dateFormat.format(date);
        }
    }

    public static String formatToDateTime(Date date) {
        var dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        if (date == null) {
            return null;
        } else {
            return dateFormat.format(date);
        }
    }
}
