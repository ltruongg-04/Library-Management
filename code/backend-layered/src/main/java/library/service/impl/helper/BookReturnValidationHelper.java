package library.service.impl.helper;

import library.common.exception.CustomBusinessException;
import library.entity.AssistantEntity;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.entity.UserEntity;
import library.repository.AssistantRepository;
import library.repository.BorrowOrderRepository;
import library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookReturnValidationHelper {

    private final BorrowOrderRepository borrowOrderRepository;
    private final UserRepository userRepository;
    private final AssistantRepository assistantRepository;

    public BorrowOrderEntity validateAndGetBorrowOrder(Integer orderId) {
        BorrowOrderEntity borrowOrder = borrowOrderRepository.findById(orderId)
                .orElseThrow(() -> new CustomBusinessException("Borrow order not found: " + orderId, HttpStatus.NOT_FOUND));

        if (borrowOrder.getStatus() != BorrowOrderStatus.BORROWED && borrowOrder.getStatus() != BorrowOrderStatus.OVERDUE && borrowOrder.getStatus() != BorrowOrderStatus.PARTIALLY_RETURNED) {
            throw new CustomBusinessException("Borrow order is not in an active status (BORROWED, OVERDUE, or PARTIALLY_RETURNED)", HttpStatus.BAD_REQUEST);
        }
        return borrowOrder;
    }

    public AssistantEntity validateAndGetAssistant(String assistantUsername) {
        UserEntity user = userRepository.findByEmail(assistantUsername)
                .orElseThrow(() -> new CustomBusinessException("User not found: " + assistantUsername, HttpStatus.NOT_FOUND));
        AssistantEntity assistant = assistantRepository.findByUserId(user.getId()).orElse(null);
        if (assistant == null && user.getRole() != UserEntity.Role.ADMIN) {
            throw new CustomBusinessException("Assistant not found for user: " + assistantUsername, HttpStatus.FORBIDDEN);
        }
        return assistant;
    }
}
