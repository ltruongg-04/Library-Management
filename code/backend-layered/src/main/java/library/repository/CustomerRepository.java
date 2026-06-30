package library.repository;

import library.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, Integer> {
    Optional<CustomerEntity> findByUserId(Integer userId);

    @org.springframework.data.jpa.repository.Query("SELECT c FROM CustomerEntity c WHERE c.libraryCardNo = :code OR c.phone = :code")
    Optional<CustomerEntity> findByLibraryCardNoOrPhone(
            @org.springframework.data.repository.query.Param("code") String code);
}
