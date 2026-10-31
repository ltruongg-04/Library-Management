package library.unitest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import library.entity.BookEntity;
import library.entity.EbookEntity;
import library.entity.UserEntity;
import library.repository.BookRepository;
import library.repository.CustomerRepository;
import library.repository.EbookRepository;
import library.repository.MembershipTierRepository;
import library.repository.UserRepository;
import library.service.FileStorageService;
import library.service.impl.EbookServiceImpl;
import library.service.impl.helper.EbookPreviewHelper;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class EbookStreamAccessTest {

    private static final int BOOK_ID = 1;
    private static final String FILE_KEY = "book.pdf";
    private static final int PREVIEW_PAGES = 2;
    private static final int TOTAL_PAGES = 4;
    private static final String READER_EMAIL = "reader@example.com";

    private final EbookRepository ebookRepository = mock(EbookRepository.class);
    private final FileStorageService fileStorageService = mock(FileStorageService.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final EbookServiceImpl ebookService = new EbookServiceImpl(
            ebookRepository,
            mock(BookRepository.class),
            fileStorageService,
            userRepository,
            mock(CustomerRepository.class),
            mock(MembershipTierRepository.class),
            new EbookPreviewHelper(objectMapper));

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void anonymousReaderOnlyReceivesPreviewPagesOfPdf() throws Exception {
        givenEbook("PDF", false, createPdf(TOTAL_PAGES));

        try (PDDocument preview = Loader.loadPDF(ebookService.getEbookStream(BOOK_ID).readAllBytes())) {
            assertThat(preview.getNumberOfPages()).isEqualTo(PREVIEW_PAGES);
            String text = new PDFTextStripper().getText(preview);
            assertThat(text).contains("PAGE-1", "PAGE-2").doesNotContain("PAGE-3", "PAGE-4");
        }
    }

    @Test
    void anonymousReaderDoesNotReceiveLockedChaptersOfWebReaderPackage() throws Exception {
        byte[] webPackage = """
                {"chapters":[{"title":"c1","html":"CHAPTER-1"},{"title":"c2","html":"CHAPTER-2"},
                {"title":"c3","html":"CHAPTER-3"},{"title":"c4","html":"CHAPTER-4"}]}
                """.getBytes(StandardCharsets.UTF_8);
        givenEbook("WEB_READER", false, webPackage);

        byte[] response = ebookService.getEbookStream(BOOK_ID).readAllBytes();

        JsonNode chapters = objectMapper.readTree(response).get("chapters");
        assertThat(chapters).hasSize(TOTAL_PAGES);
        assertThat(chapters.get(1).get("html").asText()).isEqualTo("CHAPTER-2");
        assertThat(chapters.get(2).get("title").asText()).isEqualTo("c3");
        assertThat(new String(response, StandardCharsets.UTF_8)).doesNotContain("CHAPTER-3", "CHAPTER-4");
    }

    @Test
    void freeEbookIsStreamedInFull() throws Exception {
        byte[] original = createPdf(TOTAL_PAGES);
        givenEbook("PDF", true, original);

        assertThat(ebookService.getEbookStream(BOOK_ID).readAllBytes()).isEqualTo(original);
    }

    @Test
    void loggedInReaderWithoutTierRequirementReceivesFullEbook() throws Exception {
        byte[] original = createPdf(TOTAL_PAGES);
        givenEbook("PDF", false, original);
        when(userRepository.findByEmail(READER_EMAIL)).thenReturn(Optional.of(UserEntity.builder().email(READER_EMAIL).build()));
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                READER_EMAIL, null, List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"))));

        assertThat(ebookService.getEbookStream(BOOK_ID).readAllBytes()).isEqualTo(original);
    }

    private void givenEbook(String format, boolean isFree, byte[] content) {
        EbookEntity ebook = EbookEntity.builder()
                .book(BookEntity.builder().build())
                .fileKey(FILE_KEY)
                .fileFormat(format)
                .totalPages(TOTAL_PAGES)
                .previewPages(PREVIEW_PAGES)
                .isFree(isFree)
                .isActive(true)
                .build();
        when(ebookRepository.findByBookId(BOOK_ID)).thenReturn(Optional.of(ebook));
        InputStream stream = new ByteArrayInputStream(content);
        when(fileStorageService.getFileStream(FILE_KEY)).thenReturn(stream);
    }

    private byte[] createPdf(int pages) throws IOException {
        try (PDDocument document = new PDDocument()) {
            for (int i = 1; i <= pages; i++) {
                PDPage page = new PDPage();
                document.addPage(page);
                try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                    content.beginText();
                    content.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                    content.newLineAtOffset(50, 700);
                    content.showText("PAGE-" + i);
                    content.endText();
                }
            }
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            document.save(output);
            return output.toByteArray();
        }
    }
}
