package library.repository;

import library.entity.BorrowOrderDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowOrderDetailRepository extends JpaRepository<BorrowOrderDetailEntity, Integer> {
    List<BorrowOrderDetailEntity> findByBorrowOrderId(Integer borrowOrderId);
}
