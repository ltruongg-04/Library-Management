package library.repository;

import library.entity.FavouriteEntity;
import library.entity.FavouriteId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavouriteRepository extends JpaRepository<FavouriteEntity, FavouriteId> {
    
    Optional<FavouriteEntity> findByIdCustomerIdAndIdBookId(Integer customerId, Integer bookId);
    
    boolean existsByIdCustomerIdAndIdBookId(Integer customerId, Integer bookId);

    Page<FavouriteEntity> findByIdCustomerId(Integer customerId, Pageable pageable);
}
