package com.alp.module.article.service;

import com.alp.module.article.dto.request.SaveCategoryRequest;
import com.alp.module.article.dto.response.CategoryResponse;
import com.alp.module.article.dto.response.TagResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse create(SaveCategoryRequest request);

    List<CategoryResponse> list();

    List<TagResponse> listTags();
}
