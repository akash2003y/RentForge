package com.rentforge.backend.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import org.json.JSONObject;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    // TEST KEYS
    private final String KEY_ID =
            "rzp_test_Snz3xJGXZ6i9Zv";

    private final String KEY_SECRET =
            "y1Le3Cb3aIFhV6HPDpG8vgdn";

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody PaymentRequest request
    ) {

        try {

            RazorpayClient razorpay =
                    new RazorpayClient(
                            KEY_ID,
                            KEY_SECRET
                    );

            JSONObject options =
                    new JSONObject();

            // Razorpay uses paise
            options.put(
                    "amount",
                    request.getAmount() * 100
            );

            options.put("currency", "INR");

            options.put(
                    "receipt",
                    "txn_" + System.currentTimeMillis()
            );

            Order order =
                    razorpay.orders.create(options);

            return ResponseEntity.ok(
                    order.toString()
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // DTO CLASS
    // =========================
    public static class PaymentRequest {

        private int amount;

        public int getAmount() {
            return amount;
        }

        public void setAmount(int amount) {
            this.amount = amount;
        }
    }
}