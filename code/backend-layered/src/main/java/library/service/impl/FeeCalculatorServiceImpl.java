package library.service.impl;

import library.dto.admin.BorrowingPolicyDto;
import library.entity.BorrowingPolicyEntity;
import library.entity.ConditionStatus;
import library.repository.BorrowingPolicyRepository;
import library.service.FeeCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class FeeCalculatorServiceImpl implements FeeCalculatorService {

    private final BorrowingPolicyRepository borrowingPolicyRepository;

    @Override
    public BorrowingPolicyEntity getActivePolicy() {
        return borrowingPolicyRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    BorrowingPolicyEntity defaultPolicy = BorrowingPolicyEntity.builder()
                            .maxBooks(5)
                            .maxBorrowDays(14)
                            .rentalFeePerDay(new BigDecimal("5000")) // Phí thuê 5k/ngày/cuốn
                            .overdueFinePerDay(new BigDecimal("10000")) // Phạt trễ hạn 10k/ngày
                            .lostBookMultiplier(new BigDecimal("2.0")) // Mất sách đền 200% cọc
                            .damageFeePercent(new BigDecimal("0.5")) // Hỏng đền 50% cọc
                            .maxExtensions(2)
                            .build();
                    return borrowingPolicyRepository.save(defaultPolicy);
                });
    }

    @Override
    public BigDecimal calculateRentalFee(LocalDate startDate, LocalDate endDate, int numberOfBooks) {
        if (startDate == null || endDate == null) {
            return BigDecimal.ZERO;
        }
        long days = ChronoUnit.DAYS.between(startDate, endDate);
        if (days <= 0) {
            days = 1;
        }
        BorrowingPolicyEntity policy = getActivePolicy();
        BigDecimal feePerDay = policy.getRentalFeePerDay();
        return feePerDay.multiply(new BigDecimal(days)).multiply(new BigDecimal(numberOfBooks));
    }

    @Override
    public BigDecimal calculateOverdueFee(LocalDate dueDate, LocalDate returnDate) {
        if (dueDate == null || returnDate == null || !returnDate.isAfter(dueDate)) {
            return BigDecimal.ZERO;
        }
        long overdueDays = ChronoUnit.DAYS.between(dueDate, returnDate);
        BorrowingPolicyEntity policy = getActivePolicy();
        return policy.getOverdueFinePerDay().multiply(new BigDecimal(overdueDays));
    }

    @Override
    public BigDecimal calculateDamageFee(BigDecimal depositPrice, ConditionStatus conditionStatus) {
        if (depositPrice == null || conditionStatus == ConditionStatus.NORMAL) {
            return BigDecimal.ZERO;
        }
        BorrowingPolicyEntity policy = getActivePolicy();
        if (conditionStatus == ConditionStatus.DAMAGED) {
            return depositPrice.multiply(policy.getDamageFeePercent());
        } else if (conditionStatus == ConditionStatus.LOST) {
            return depositPrice.multiply(policy.getLostBookMultiplier());
        }
        return BigDecimal.ZERO;
    }

    @Override
    @Transactional
    public BorrowingPolicyDto updatePolicy(BorrowingPolicyDto dto) {
        BorrowingPolicyEntity policy = getActivePolicy();

        if (dto.getMaxBorrowDays() != null) {
            policy.setMaxBorrowDays(dto.getMaxBorrowDays());
        }
        if (dto.getMaxBooks() != null) {
            policy.setMaxBooks(dto.getMaxBooks());
        }
        if (dto.getRentalFeePerDay() != null) {
            policy.setRentalFeePerDay(dto.getRentalFeePerDay());
        }
        if (dto.getOverdueFinePerDay() != null) {
            policy.setOverdueFinePerDay(dto.getOverdueFinePerDay());
        }
        if (dto.getDamageFeePercent() != null) {
            policy.setDamageFeePercent(dto.getDamageFeePercent());
        }
        if (dto.getLostBookMultiplier() != null) {
            policy.setLostBookMultiplier(dto.getLostBookMultiplier());
        }
        if (dto.getMaxExtensions() != null) {
            policy.setMaxExtensions(dto.getMaxExtensions());
        }

        BorrowingPolicyEntity saved = borrowingPolicyRepository.save(policy);

        return BorrowingPolicyDto.builder()
                .id(saved.getId())
                .maxBorrowDays(saved.getMaxBorrowDays())
                .maxBooks(saved.getMaxBooks())
                .rentalFeePerDay(saved.getRentalFeePerDay())
                .overdueFinePerDay(saved.getOverdueFinePerDay())
                .damageFeePercent(saved.getDamageFeePercent())
                .lostBookMultiplier(saved.getLostBookMultiplier())
                .maxExtensions(saved.getMaxExtensions())
                .build();
    }
}
