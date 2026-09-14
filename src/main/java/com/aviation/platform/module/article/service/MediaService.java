package com.aviation.platform.module.article.service;

import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.article.dto.response.MediaAssetResponse;
import com.aviation.platform.module.article.entity.MediaAsset;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface MediaService {

    MediaAssetResponse upload(MultipartFile file, CurrentUser actor);

    MediaAsset get(Long id);

    Resource loadFile(Long id);
}
