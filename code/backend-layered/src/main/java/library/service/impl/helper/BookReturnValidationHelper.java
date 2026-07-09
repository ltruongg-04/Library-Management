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
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy phiếu mượn: " + orderId, HttpStatus.NOT_FOUND));

        if (borrowOrder.getStatus() != BorrowOrderStatus.BORROWED && borrowOrder.getStatus() != BorrowOrderStatus.OVERDUE && borrowOrder.getStatus() != BorrowOrderStatus.PARTIALLY_RETURNED) {
            throw new CustomBusinessException("Phiếu mượn không ở trạng thái đang hoạt động (đang mượn, quá hạn hoặc trả một phần)", HttpStatus.BAD_REQUEST);
        }
        return borrowOrder;
    }

    public AssistantEntity validateAndGetAssistant(String assistantUsername) {
        UserEntity user = userRepository.findByEmail(assistantUsername)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy người dùng: " + assistantUsername, HttpStatus.NOT_FOUND));
        AssistantEntity assistant = assistantRepository.findByUserId(user.getId()).orElse(null);
        if (assistant == null && user.getRole() != UserEntity.Role.ADMIN) {
            throw new CustomBusinessException("Không tìm thấy hồ sơ trợ lý cho người dùng: " + assistantUsername, HttpStatus.FORBIDDEN);
        }
        return assistant;
    }
}
