package com.aviation.platform.module.article.service;

import com.aviation.platform.module.article.dto.request.SaveCategoryRequest;
import com.aviation.platform.module.article.dto.response.CategoryResponse;
import com.aviation.platform.module.article.dto.response.TagResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse create(SaveCategoryRequest request);

    List<CategoryResponse> list();

    List<TagResponse> listTags();
}
