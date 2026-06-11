package com.rentforge.backend.repository;

import com.rentforge.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    // =========================
    // FIND OVERLAPPING BOOKINGS
    // ONLY ACTIVE BOOKINGS
    // =========================
    List<Booking>
    findByEquipmentIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusNot(
            Long equipmentId,
            LocalDate endDate,
            LocalDate startDate,
            String status
    );

    // =========================
    // USER BOOKINGS
    // =========================
    List<Booking> findByEmail(String email);

    // NEWEST BOOKINGS FIRST
    List<Booking> findAllByOrderByIdDesc();
}
