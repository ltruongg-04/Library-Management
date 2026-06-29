package library.service;

import library.dto.request.AuthorRequest;
import library.dto.response.AuthorResponse;
import library.entity.AuthorEntity;
import library.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    public List<AuthorResponse> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AuthorResponse createAuthor(AuthorRequest request) {
        if (authorRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tác giả đã tồn tại");
        }

        AuthorEntity author = AuthorEntity.builder()
                .name(request.getName())
                .biography(request.getBiography())
                .build();

        return mapToResponse(authorRepository.save(author));
    }

    @Transactional
    public AuthorResponse updateAuthor(@NonNull Integer id, AuthorRequest request) {
        AuthorEntity author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả"));

        if (!author.getName().equals(request.getName()) && authorRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tên tác giả đã tồn tại");
        }

        author.setName(request.getName());
        author.setBiography(request.getBiography());

        return mapToResponse(authorRepository.save(author));
    }

    @Transactional
    public void deleteAuthor(@NonNull Integer id) {
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy tác giả");
        }
        authorRepository.deleteById(id);
    }

    private AuthorResponse mapToResponse(AuthorEntity entity) {
        return AuthorResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .biography(entity.getBiography())
                .build();
    }
}
