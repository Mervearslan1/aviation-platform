package com.aviation.platform.module.learning.entity;

public enum CatalogStatus {
    DRAFT,
    PUBLISHED,
    ARCHIVED;

    public boolean isPublic() {
        return this == PUBLISHED;
    }
}
