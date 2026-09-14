package com.aviation.platform.module.article.service.impl;

import com.aviation.platform.common.config.AviationProperties;
import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.article.dto.response.MediaAssetResponse;
import com.aviation.platform.module.article.entity.MediaAsset;
import com.aviation.platform.module.article.entity.MediaType;
import com.aviation.platform.module.article.repository.MediaAssetRepository;
import com.aviation.platform.module.article.service.MediaService;
import com.aviation.platform.module.user.entity.RoleName;
import com.aviation.platform.module.user.entity.User;
import com.aviation.platform.module.user.repository.UserRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class MediaServiceImpl implements MediaService {

    private static final Map<String, MediaType> TYPES = Map.ofEntries(
            Map.entry("image/jpeg", MediaType.IMAGE),
            Map.entry("image/png", MediaType.IMAGE),
            Map.entry("image/webp", MediaType.IMAGE),
            Map.entry("image/gif", MediaType.IMAGE),
            Map.entry("video/mp4", MediaType.VIDEO),
            Map.entry("video/webm", MediaType.VIDEO),
            Map.entry("audio/mpeg", MediaType.AUDIO),
            Map.entry("audio/mp3", MediaType.AUDIO),
            Map.entry("audio/wav", MediaType.AUDIO),
            Map.entry("audio/ogg", MediaType.AUDIO)
    );

    private final MediaAssetRepository mediaAssetRepository;
    private final UserRepository userRepository;
    private final AviationProperties properties;

    public MediaServiceImpl(
            MediaAssetRepository mediaAssetRepository,
            UserRepository userRepository,
            AviationProperties properties
    ) {
        this.mediaAssetRepository = mediaAssetRepository;
        this.userRepository = userRepository;
        this.properties = properties;
    }

    @Override
    @Transactional
    public MediaAssetResponse upload(MultipartFile file, CurrentUser actor) {
        if (!actor.hasRole(RoleName.AUTHOR) && !actor.hasRole(RoleName.EDITOR) && !actor.hasRole(RoleName.ADMIN)) {
            throw ApiException.forbidden("AUTHOR role is required to upload media");
        }
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("File is required");
        }
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        MediaType mediaType = TYPES.get(contentType);
        if (mediaType == null) {
            throw ApiException.badRequest("Unsupported media type. Use image, video (mp4/webm) or audio (mp3/wav/ogg)");
        }
        long max = switch (mediaType) {
            case IMAGE -> media().maxImageBytes();
            case VIDEO -> media().maxVideoBytes();
            case AUDIO -> media().maxAudioBytes();
        };
        if (file.getSize() > max) {
            throw ApiException.badRequest("File exceeds size limit for " + mediaType);
        }

        String ext = extension(file.getOriginalFilename(), contentType);
        String key = UUID.randomUUID() + ext;
        Path dir = Path.of(media().directory());
        try {
            Files.createDirectories(dir);
            Path target = dir.resolve(key);
            file.transferTo(target);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not store media file", ex);
        }

        User uploader = userRepository.findById(actor.id()).orElseThrow(() -> ApiException.notFound("User not found"));
        MediaAsset asset = mediaAssetRepository.save(new MediaAsset(
                uploader,
                mediaType,
                file.getOriginalFilename() == null ? key : file.getOriginalFilename(),
                contentType,
                file.getSize(),
                key
        ));
        return MediaAssetResponse.from(asset);
    }

    @Override
    @Transactional(readOnly = true)
    public MediaAsset get(Long id) {
        return mediaAssetRepository.findById(id).orElseThrow(() -> ApiException.notFound("Media not found"));
    }

    @Override
    public Resource loadFile(Long id) {
        MediaAsset asset = get(id);
        Path path = Path.of(media().directory()).resolve(asset.getStorageKey());
        if (!Files.exists(path)) {
            throw ApiException.notFound("Media file missing");
        }
        return new FileSystemResource(path);
    }

    private AviationProperties.Media media() {
        AviationProperties.Media configured = properties.media();
        if (configured == null) {
            return new AviationProperties.Media("./data/media", 10_485_760, 52_428_800, 20_971_520);
        }
        return configured;
    }

    private static String extension(String filename, String contentType) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf('.')).toLowerCase(Locale.ROOT);
        }
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            case "video/mp4" -> ".mp4";
            case "video/webm" -> ".webm";
            case "audio/wav" -> ".wav";
            case "audio/ogg" -> ".ogg";
            case "audio/mpeg", "audio/mp3" -> ".mp3";
            default -> ".jpg";
        };
    }
}
