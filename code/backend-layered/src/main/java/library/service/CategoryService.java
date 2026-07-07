package library.service;

import library.dto.request.CategoryRequest;
import library.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    List<CategoryResponse> getAllCategoriesWithBooks();
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(Integer id, CategoryRequest request);
    void deleteCategory(Integer id);
}
