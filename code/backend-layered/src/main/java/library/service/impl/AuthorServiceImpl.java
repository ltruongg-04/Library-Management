package library.service.impl;

import library.dto.request.AuthorRequest;
import library.dto.response.AuthorResponse;
import library.entity.AuthorEntity;
import library.common.constant.CacheNames;
import library.repository.AuthorRepository;
import library.service.AuthorService;
import library.service.CacheInvalidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import library.common.exception.CustomBusinessException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final CacheInvalidationService cacheInvalidationService;

    @Override
    @Cacheable(value = CacheNames.AUTHORS_ALL, key = "'all'")
    public List<AuthorResponse> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AuthorResponse createAuthor(AuthorRequest request) {
        if (authorRepository.existsByName(request.getName())) {
            throw new CustomBusinessException("Tác giả đã tồn tại", HttpStatus.CONFLICT);
        }

        AuthorEntity author = AuthorEntity.builder()
                .name(request.getName())
                .biography(request.getBiography())
                .build();

        AuthorResponse response = mapToResponse(authorRepository.save(author));
        cacheInvalidationService.evictCatalogCaches();
        return response;
    }

    @Override
    @Transactional
    public AuthorResponse updateAuthor(@NonNull Integer id, AuthorRequest request) {
        AuthorEntity author = authorRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy tác giả", HttpStatus.NOT_FOUND));

        if (!author.getName().equals(request.getName()) && authorRepository.existsByName(request.getName())) {
            throw new CustomBusinessException("Tên tác giả đã tồn tại", HttpStatus.CONFLICT);
        }

        author.setName(request.getName());
        author.setBiography(request.getBiography());

        AuthorResponse response = mapToResponse(authorRepository.save(author));
        cacheInvalidationService.evictCatalogCaches();
        return response;
    }

    @Override
    @Transactional
    public void deleteAuthor(@NonNull Integer id) {
        if (!authorRepository.existsById(id)) {
            throw new CustomBusinessException("Không tìm thấy tác giả", HttpStatus.NOT_FOUND);
        }
        authorRepository.deleteById(id);
        cacheInvalidationService.evictCatalogCaches();
    }

    private AuthorResponse mapToResponse(AuthorEntity entity) {
        return AuthorResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .biography(entity.getBiography())
                .build();
    }
}
