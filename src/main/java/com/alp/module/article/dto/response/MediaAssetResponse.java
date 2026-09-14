package com.alp.module.article.dto.response;

import com.alp.module.article.entity.MediaAsset;
import com.alp.module.article.entity.MediaType;

import java.time.Instant;

public record MediaAssetResponse(
        Long id,
        MediaType mediaType,
        String originalFilename,
        String contentType,
        long sizeBytes,
        String url,
        Instant createdAt
) {

    public static MediaAssetResponse from(MediaAsset asset) {
        return new MediaAssetResponse(
                asset.getId(),
                asset.getMediaType(),
                asset.getOriginalFilename(),
                asset.getContentType(),
                asset.getSizeBytes(),
                asset.publicUrl(),
                asset.getCreatedAt()
        );
    }
}
