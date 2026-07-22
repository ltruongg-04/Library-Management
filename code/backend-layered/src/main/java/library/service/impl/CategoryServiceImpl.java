package library.service.impl;

import library.dto.request.CategoryRequest;
import library.dto.response.CategoryResponse;
import library.entity.CategoryEntity;
import library.common.constant.CacheNames;
import library.repository.CategoryRepository;
import library.service.CacheInvalidationService;
import library.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import library.common.exception.CustomBusinessException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CacheInvalidationService cacheInvalidationService;

    @Override
    @Cacheable(value = CacheNames.CATEGORIES_ALL, key = "'all'")
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = CacheNames.CATEGORIES_WITH_BOOKS, key = "'all'")
    public List<CategoryResponse> getAllCategoriesWithBooks() {
        return categoryRepository.findAllWithBooks().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new CustomBusinessException("Thể loại đã tồn tại", HttpStatus.CONFLICT);
        }

        CategoryEntity category = CategoryEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        CategoryResponse response = mapToResponse(categoryRepository.save(category));
        cacheInvalidationService.evictCatalogCaches();
        return response;
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Integer id, CategoryRequest request) {
        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy thể loại", HttpStatus.NOT_FOUND));

        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new CustomBusinessException("Tên thể loại đã tồn tại", HttpStatus.CONFLICT);
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        CategoryResponse response = mapToResponse(categoryRepository.save(category));
        cacheInvalidationService.evictCatalogCaches();
        return response;
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new CustomBusinessException("Không tìm thấy thể loại", HttpStatus.NOT_FOUND);
        }
        
        categoryRepository.deleteCategoryAssociations(id);
        categoryRepository.deleteById(id);
        cacheInvalidationService.evictCatalogCaches();
    }

    private CategoryResponse mapToResponse(CategoryEntity entity) {
        return CategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }
}
