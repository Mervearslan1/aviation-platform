package com.aviation.platform.module.article.controller;

import com.aviation.platform.common.response.ApiResponse;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.article.dto.response.MediaAssetResponse;
import com.aviation.platform.module.article.entity.MediaAsset;
import com.aviation.platform.module.article.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/media")
@Tag(name = "Media", description = "Yazıya görsel, video, ses ekleme")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Medya yükle (image/video/audio)")
    public ApiResponse<MediaAssetResponse> upload(
            @RequestPart("file") MultipartFile file,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(mediaService.upload(file, actor));
    }

    @GetMapping("/{id}")
    @SecurityRequirements
    @Operation(summary = "Medya dosyasını indir / oynat")
    public ResponseEntity<Resource> file(@PathVariable Long id) {
        MediaAsset asset = mediaService.get(id);
        Resource resource = mediaService.loadFile(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + asset.getOriginalFilename() + "\"")
                .contentType(MediaType.parseMediaType(asset.getContentType()))
                .body(resource);
    }

    @GetMapping("/{id}/info")
    @SecurityRequirements
    @Operation(summary = "Medya bilgisi")
    public ApiResponse<MediaAssetResponse> info(@PathVariable Long id) {
        return ApiResponse.of(MediaAssetResponse.from(mediaService.get(id)));
    }
}
