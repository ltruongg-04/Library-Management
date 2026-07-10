package library.service.impl;

import library.dto.response.TagResponse;
import library.entity.TagEntity;
import library.repository.TagRepository;
import library.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TagResponse mapToResponse(TagEntity entity) {
        return TagResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }
}
