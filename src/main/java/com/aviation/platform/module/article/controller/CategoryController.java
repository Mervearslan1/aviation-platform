package com.aviation.platform.module.article.controller;

import com.aviation.platform.common.response.ApiResponse;
import com.aviation.platform.module.article.dto.request.SaveCategoryRequest;
import com.aviation.platform.module.article.dto.response.CategoryResponse;
import com.aviation.platform.module.article.dto.response.TagResponse;
import com.aviation.platform.module.article.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Categories", description = "Blog kategorileri ve etiketler")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    @SecurityRequirements
    @Operation(summary = "Kategoriler")
    public ApiResponse<List<CategoryResponse>> categories() {
        return ApiResponse.of(categoryService.list());
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Kategori oluştur")
    public ApiResponse<CategoryResponse> create(@Valid @RequestBody SaveCategoryRequest request) {
        return ApiResponse.of(categoryService.create(request));
    }

    @GetMapping("/tags")
    @SecurityRequirements
    @Operation(summary = "Etiketler")
    public ApiResponse<List<TagResponse>> tags() {
        return ApiResponse.of(categoryService.listTags());
    }
}
