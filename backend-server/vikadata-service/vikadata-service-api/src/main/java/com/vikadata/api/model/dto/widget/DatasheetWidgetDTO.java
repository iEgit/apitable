package com.vikadata.api.model.dto.widget;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DatasheetWidgetDTO {

    private String dstId;

    private String widgetId;

    private String sourceId;

    public DatasheetWidgetDTO(String dstId, String sourceId) {
        this.dstId = dstId;
        this.sourceId = sourceId;
    }
}
