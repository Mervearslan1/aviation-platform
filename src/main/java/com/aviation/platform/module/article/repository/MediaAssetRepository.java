package com.aviation.platform.module.article.repository;

import com.aviation.platform.module.article.entity.MediaAsset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
}
