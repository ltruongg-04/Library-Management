package library.repository;

import library.entity.AuthorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<AuthorEntity, Integer> {
    Optional<AuthorEntity> findByName(String name);
    boolean existsByName(String name);
}
