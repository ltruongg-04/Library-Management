package library.repository;

import library.entity.StockReceiptDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockReceiptDetailRepository extends JpaRepository<StockReceiptDetailEntity, Integer> {
    List<StockReceiptDetailEntity> findByStockReceiptId(Integer receiptId);
}
