package com.rentforge.backend.controller;

import com.rentforge.backend.entity.Booking;
import com.rentforge.backend.entity.Equipment;

import com.rentforge.backend.repository.BookingRepository;
import com.rentforge.backend.repository.EquipmentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import java.time.temporal.ChronoUnit;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    // =========================
    // CREATE BOOKING
    // =========================
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody Booking booking
    ) {

        // DEFAULT STATUS
        if (
            booking.getStatus() == null ||
            booking.getStatus().isEmpty()
        ) {

            booking.setStatus("Pending");
        }

        // DEFAULT QUANTITY
        if (booking.getQuantity() <= 0) {
            booking.setQuantity(1);
        }

        // =========================
        // FIND EQUIPMENT
        // =========================
        Optional<Equipment> optionalEquipment =
                equipmentRepository.findById(
                        booking.getEquipmentId()
                );

        if (optionalEquipment.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Equipment not found");
        }

        Equipment equipment =
                optionalEquipment.get();

        // =========================
        // FIND OVERLAPPING BOOKINGS
        // =========================
        List<Booking> overlappingBookings =
                bookingRepository
                .findByEquipmentIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusNot(
                        booking.getEquipmentId(),
                        booking.getEndDate(),
                        booking.getStartDate(),
                        "Cancelled"
                );

        // =========================
        // CALCULATE BOOKED UNITS
        // =========================
        int bookedUnits = overlappingBookings
                .stream()
                .mapToInt(Booking::getQuantity)
                .sum();

        // =========================
        // AVAILABLE UNITS
        // =========================
        int availableUnits =
                equipment.getQuantity()
                - bookedUnits;

        // =========================
        // CHECK STOCK
        // =========================
        if (
            booking.getQuantity()
            > availableUnits
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "Only "
                        + availableUnits
                        + " units available for selected dates"
                    );
        }

        // =========================
        // CALCULATE RENT DAYS
        // =========================
        long totalDays =
                ChronoUnit.DAYS.between(
                        booking.getStartDate(),
                        booking.getEndDate()
                ) + 1;

        // =========================
        // PAYMENT CALCULATIONS
        // =========================
        double totalRent =
                totalDays
                * equipment.getPrice()
                * booking.getQuantity();

        double depositAmount =
                equipment.getDepositAmount()
                * booking.getQuantity();

        double totalAmount =
                totalRent + depositAmount;

        booking.setTotalRent(totalRent);

        booking.setDepositAmount(
                depositAmount
        );

        booking.setTotalAmount(
                totalAmount
        );

        // =========================
        // SAVE BOOKING
        // =========================
        Booking savedBooking =
                bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }

    // =========================
    // LIVE AVAILABILITY CHECK
    // =========================
    @GetMapping("/availability/{equipmentId}")
    public ResponseEntity<?> checkAvailability(

            @PathVariable Long equipmentId,

            @RequestParam LocalDate startDate,

            @RequestParam LocalDate endDate
    ) {

        Optional<Equipment> optionalEquipment =
                equipmentRepository.findById(
                        equipmentId
                );

        if (optionalEquipment.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Equipment not found");
        }

        Equipment equipment =
                optionalEquipment.get();

        // OVERLAPPING BOOKINGS
        List<Booking> overlappingBookings =
                bookingRepository
                .findByEquipmentIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusNot(
                        equipmentId,
                        endDate,
                        startDate,
                        "Cancelled"
                );

        // TOTAL BOOKED UNITS
        int bookedUnits =
                overlappingBookings
                .stream()
                .mapToInt(Booking::getQuantity)
                .sum();

        // AVAILABLE UNITS
        int availableUnits =
                equipment.getQuantity()
                - bookedUnits;

        if (availableUnits < 0) {
            availableUnits = 0;
        }

        return ResponseEntity.ok(
                availableUnits
        );
    }

    // =========================
    // GET ALL BOOKINGS
    // =========================
    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingRepository.findAllByOrderByIdDesc();
    }

    // =========================
    // GET BOOKINGS BY EMAIL
    // =========================
    @GetMapping("/user/{email}")
    public List<Booking> getBookingsByEmail(
            @PathVariable String email
    ) {

        return bookingRepository.findByEmail(email);
    }

    // =========================
    // UPDATE BOOKING STATUS
    // =========================
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(

            @PathVariable Long id,

            @RequestBody Map<String, String> request
    ) {

        Optional<Booking> optionalBooking =
                bookingRepository.findById(id);

        if (optionalBooking.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Booking not found");
        }

        String status =
                request.get("status");

        if (
            status == null ||
            status.trim().isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body("Status is required");
        }

        Booking booking =
                optionalBooking.get();

        booking.setStatus(status);

        bookingRepository.save(booking);

        return ResponseEntity.ok(
                "Booking status updated successfully"
        );
    }

    // =========================
    // DELETE BOOKING
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(
            @PathVariable Long id
    ) {

        Optional<Booking> optionalBooking =
                bookingRepository.findById(id);

        if (optionalBooking.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Booking not found");
        }

        bookingRepository.deleteById(id);

        return ResponseEntity.ok(
                "Booking deleted successfully"
        );
    }
}