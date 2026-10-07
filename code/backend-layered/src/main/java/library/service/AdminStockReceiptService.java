package library.service;

import library.dto.admin.AdminCreateStockReceiptRequest;
import library.dto.admin.AdminStockReceiptDto;
import java.util.List;

public interface AdminStockReceiptService {
    List<AdminStockReceiptDto> getAllReceipts();
    AdminStockReceiptDto getReceiptDetail(Integer id);
    AdminStockReceiptDto createReceipt(AdminCreateStockReceiptRequest request, String username);
}
