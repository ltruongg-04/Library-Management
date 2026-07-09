package library.unitest;

import library.common.exception.CustomBusinessException;
import library.dto.request.BookCreateRequest;
import library.dto.response.BookResponse;
import library.entity.BookEntity;
import library.entity.TagEntity;
import library.mapper.BookMapper;
import library.repository.AuthorRepository;
import library.repository.BookRepository;
import library.repository.CategoryRepository;
import library.repository.TagRepository;
import library.service.BookCopyService;
import library.service.CacheInvalidationService;
import library.service.SystemLogService;
import library.service.impl.BookCommandServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookCommandServiceImplTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private AuthorRepository authorRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private SystemLogService systemLogService;

    @Mock
    private BookCopyService bookCopyService;

    @Mock
    private CacheInvalidationService cacheInvalidationService;

    @Mock
    private library.repository.BookCopyRepository bookCopyRepository;

    private BookCommandServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new BookCommandServiceImpl(
                bookRepository,
                categoryRepository,
                authorRepository,
                tagRepository,
                systemLogService,
                bookCopyService,
                bookCopyRepository,
                cacheInvalidationService,
                new BookMapper());
    }

    @Test
    void createBookNormalizesIsbnAndReusesExistingTagIgnoringCase() {
        TagEntity existingTag = TagEntity.builder().name("Science Fiction").build();
        existingTag.setId(7);

        BookCreateRequest request = BookCreateRequest.builder()
                .title("Clean Code")
                .isbn(" 9780132350884 ")
                .newTags(List.of(" science  fiction ", "Science Fiction", " "))
                .build();

        when(bookRepository.existsByNormalizedTitle("Clean Code")).thenReturn(false);
        when(bookRepository.existsByIsbn("9780132350884")).thenReturn(false);
        when(tagRepository.findByNameIgnoreCase("science fiction")).thenReturn(Optional.of(existingTag));
        when(bookRepository.save(any(BookEntity.class))).thenAnswer(invocation -> {
            BookEntity book = invocation.getArgument(0);
            book.setId(1);
            return book;
        });

        BookResponse response = service.createBook(request);

        ArgumentCaptor<BookEntity> bookCaptor = ArgumentCaptor.forClass(BookEntity.class);
        verify(bookRepository).save(bookCaptor.capture());
        BookEntity savedBook = bookCaptor.getValue();

        assertThat(savedBook.getIsbn()).isEqualTo("9780132350884");
        assertThat(savedBook.getTags()).containsExactly(existingTag);
        assertThat(response.getTags()).extracting("name").containsExactly("Science Fiction");
        verify(tagRepository, never()).save(any(TagEntity.class));
    }

    @Test
    void createBookRejectsMissingTagIds() {
        TagEntity existingTag = TagEntity.builder().name("Classic").build();
        existingTag.setId(1);

        BookCreateRequest request = BookCreateRequest.builder()
                .title("Domain-Driven Design")
                .tagIds(List.of(1, 99))
                .build();

        when(bookRepository.existsByNormalizedTitle("Domain-Driven Design")).thenReturn(false);
        when(tagRepository.findAllById(List.of(1, 99))).thenReturn(List.of(existingTag));

        assertThatThrownBy(() -> service.createBook(request))
                .isInstanceOf(CustomBusinessException.class)
                .hasMessageContaining("99");

        verify(bookRepository, never()).save(any(BookEntity.class));
    }

    @Test
    void deleteBookThrowsExceptionWhenActiveCopiesExist() {
        BookEntity book = BookEntity.builder().title("To Kill a Mockingbird").build();
        book.setId(1);

        when(bookRepository.findById(1)).thenReturn(Optional.of(book));
        when(bookCopyRepository.existsByBookIdAndStatusIn(1, java.util.Arrays.asList(library.entity.BookCopyStatus.BORROWED, library.entity.BookCopyStatus.RESERVED)))
                .thenReturn(true);

        assertThatThrownBy(() -> service.deleteBook(1))
                .isInstanceOf(CustomBusinessException.class)
                .hasMessageContaining("đang có bản sao được mượn hoặc đặt trước");

        verify(bookCopyRepository, never()).updateStatusByBookId(any(), any(), any());
        verify(bookRepository, never()).softDeleteById(any());
    }

    @Test
    void deleteBookSuccessUpdatesCopiesAndSoftDeletes() {
        BookEntity book = BookEntity.builder().title("To Kill a Mockingbird").build();
        book.setId(1);

        when(bookRepository.findById(1)).thenReturn(Optional.of(book));
        when(bookCopyRepository.existsByBookIdAndStatusIn(1, java.util.Arrays.asList(library.entity.BookCopyStatus.BORROWED, library.entity.BookCopyStatus.RESERVED)))
                .thenReturn(false);

        service.deleteBook(1);

        verify(bookCopyRepository).updateStatusByBookId(1, library.entity.BookCopyStatus.MAINTENANCE, "Sách đã bị ngừng lưu hành (xóa mềm)");
        verify(bookRepository).softDeleteById(1);
        verify(systemLogService).logAction("Xóa sách", "Admin đã xóa sách (xóa mềm): To Kill a Mockingbird");
        verify(cacheInvalidationService).evictBookCaches();
    }
}
