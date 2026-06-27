package library.repository;

import library.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Integer> {
    Optional<CategoryEntity> findByName(String name);
    boolean existsByName(String name);

    @Modifying
    @Query(value = "DELETE FROM book_categories WHERE category_id = :categoryId", nativeQuery = true)
    void deleteCategoryAssociations(@Param("categoryId") Integer categoryId);
}
