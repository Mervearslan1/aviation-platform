package com.aviation.platform.module.aircraft.dto;

import com.aviation.platform.module.aircraft.entity.CockpitPart;

public record PartResponse(
        Long id,
        String code,
        String panel,
        String nameEn,
        String nameTr,
        String location,
        String functionTr,
        String category,
        String variant,
        boolean learned
) {

    public static PartResponse from(CockpitPart part, boolean learned) {
        return new PartResponse(
                part.getId(),
                part.getCode(),
                part.getPanel(),
                part.getNameEn(),
                part.getNameTr(),
                part.getLocation(),
                part.getFunctionTr(),
                part.getCategory(),
                part.getVariant() == null ? "Both" : part.getVariant(),
                learned
        );
    }
}
