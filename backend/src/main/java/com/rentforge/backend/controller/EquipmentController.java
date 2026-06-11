package com.rentforge.backend.controller;

import com.rentforge.backend.entity.Equipment;
import com.rentforge.backend.repository.EquipmentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentRepository equipmentRepository;

    // =========================
    // GET ALL EQUIPMENT
    // =========================
    @GetMapping
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    // =========================
    // UPLOAD EQUIPMENT
    // =========================
    @PostMapping("/upload")
    public ResponseEntity<?> uploadEquipment(

            @RequestParam("name") String name,

            @RequestParam("price") double price,

            // NEW
            @RequestParam("depositAmount")
            double depositAmount,

            @RequestParam("availability")
            String availability,

            @RequestParam("quantity")
            int quantity,

            @RequestParam("image")
            MultipartFile image
    ) {

        try {

            // CREATE UPLOAD DIRECTORY
            String uploadDir =
                    System.getProperty("user.dir")
                    + "/uploads/";

            File dir = new File(uploadDir);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            // UNIQUE FILE NAME
            String fileName =
                    UUID.randomUUID()
                    + "_"
                    + image.getOriginalFilename();

            // SAVE FILE
            File destination =
                    new File(uploadDir + fileName);

            image.transferTo(destination);

            // CREATE EQUIPMENT
            Equipment equipment = new Equipment();

            equipment.setName(name);

            equipment.setPrice(price);

            // NEW
            equipment.setDepositAmount(
                    depositAmount
            );

            // AUTO AVAILABILITY
            if (quantity > 0) {

                equipment.setAvailability(
                        "Available"
                );

            } else {

                equipment.setAvailability(
                        "Unavailable"
                );
            }

            equipment.setQuantity(quantity);

            // IMAGE PATH
            equipment.setImageUrl(
                    "uploads/" + fileName
            );

            equipmentRepository.save(equipment);

            return ResponseEntity.ok(
                    "Equipment uploaded successfully"
            );

        } catch (IOException e) {

            return ResponseEntity
                    .status(500)
                    .body("Image upload failed");
        }
    }

    // =========================
    // DELETE EQUIPMENT
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipment(
            @PathVariable Long id
    ) {

        return equipmentRepository.findById(id)
                .map(equipment -> {

                    equipmentRepository
                            .deleteById(id);

                    return ResponseEntity.ok(
                            "Equipment deleted successfully"
                    );

                })
                .orElseGet(() ->

                        ResponseEntity
                                .status(404)
                                .body(
                                        "Equipment not found"
                                )
                );
    }

    // =========================
    // UPDATE EQUIPMENT
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEquipment(

            @PathVariable Long id,

            @RequestBody Equipment updatedEquipment
    ) {

        Optional<Equipment> existingEquipment =
                equipmentRepository.findById(id);

        if (existingEquipment.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Equipment not found");
        }

        Equipment equipment =
                existingEquipment.get();

        equipment.setName(
                updatedEquipment.getName()
        );

        equipment.setPrice(
                updatedEquipment.getPrice()
        );

        // NEW
        equipment.setDepositAmount(
                updatedEquipment.getDepositAmount()
        );

        equipment.setQuantity(
                updatedEquipment.getQuantity()
        );

        // AUTO AVAILABILITY
        if (updatedEquipment.getQuantity() > 0) {

            equipment.setAvailability(
                    "Available"
            );

        } else {

            equipment.setAvailability(
                    "Unavailable"
            );
        }

        equipmentRepository.save(equipment);

        return ResponseEntity.ok(
                "Equipment updated successfully"
        );
    }

    // =========================
    // UPDATE QUANTITY
    // =========================
    @PutMapping("/{id}/quantity")
    public ResponseEntity<?> updateQuantity(

            @PathVariable Long id,

            @RequestBody Map<String, Integer> body
    ) {

        Optional<Equipment> optionalEquipment =
                equipmentRepository.findById(id);

        if (optionalEquipment.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Equipment not found");
        }

        Equipment equipment =
                optionalEquipment.get();

        int quantity = body.get("quantity");

        // NO NEGATIVE QUANTITY
        if (quantity < 0) {
            quantity = 0;
        }

        equipment.setQuantity(quantity);

        // AUTO AVAILABILITY
        if (quantity == 0) {

            equipment.setAvailability(
                    "Unavailable"
            );

        } else {

            equipment.setAvailability(
                    "Available"
            );
        }

        equipmentRepository.save(equipment);

        return ResponseEntity.ok(equipment);
    }
}