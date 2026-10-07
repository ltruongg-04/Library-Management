package library.repository;

import library.entity.BannerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<BannerEntity, Integer> {
    List<BannerEntity> findByIsActiveOrderByDisplayOrderAsc(Boolean isActive);
}
