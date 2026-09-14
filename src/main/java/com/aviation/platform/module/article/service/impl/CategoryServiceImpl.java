package com.aviation.platform.module.article.service.impl;

import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.util.SlugUtil;
import com.aviation.platform.module.article.dto.request.SaveCategoryRequest;
import com.aviation.platform.module.article.dto.response.CategoryResponse;
import com.aviation.platform.module.article.dto.response.TagResponse;
import com.aviation.platform.module.article.entity.ArticleCategory;
import com.aviation.platform.module.article.repository.ArticleCategoryRepository;
import com.aviation.platform.module.article.repository.ArticleTagRepository;
import com.aviation.platform.module.article.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final ArticleCategoryRepository categoryRepository;
    private final ArticleTagRepository tagRepository;

    public CategoryServiceImpl(ArticleCategoryRepository categoryRepository, ArticleTagRepository tagRepository) {
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    public CategoryResponse create(SaveCategoryRequest request) {
        String name = request.name().trim();
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw ApiException.conflict("Category name already exists");
        }
        String slug = SlugUtil.slugify(name);
        if (categoryRepository.existsBySlug(slug)) {
            throw ApiException.conflict("Category slug already exists");
        }
        ArticleCategory category = new ArticleCategory(name, slug, request.description());
        categoryRepository.save(category);
        return CategoryResponse.from(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> list() {
        return categoryRepository.findAll().stream().map(CategoryResponse::from).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TagResponse> listTags() {
        return tagRepository.findAll().stream().map(TagResponse::from).toList();
    }
}
