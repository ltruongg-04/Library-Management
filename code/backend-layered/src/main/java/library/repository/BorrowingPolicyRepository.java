package library.repository;

import library.entity.BorrowingPolicyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BorrowingPolicyRepository extends JpaRepository<BorrowingPolicyEntity, Integer> {
}
