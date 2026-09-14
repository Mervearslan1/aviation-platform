package com.alp.module.article.service;

import com.alp.common.security.principal.CurrentUser;
import com.alp.module.article.dto.response.MediaAssetResponse;
import com.alp.module.article.entity.MediaAsset;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface MediaService {

    MediaAssetResponse upload(MultipartFile file, CurrentUser actor);

    MediaAsset get(Long id);

    Resource loadFile(Long id);
}
