package com.rentforge.backend.controller;

import com.rentforge.backend.entity.User;
import com.rentforge.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // =========================
    // HEALTH CHECK
    // =========================
    @GetMapping("/")
    public String home() {
        return "RentForge Backend Running 🚀";
    }

    // =========================
    // LOCAL REGISTER
    // =========================
    @PostMapping("/register")
    public Object registerUser(@RequestBody User user) {

        // Duplicate email check
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists";
        }

        // Default role
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        // Default provider
        if (user.getProvider() == null || user.getProvider().isEmpty()) {
            user.setProvider("LOCAL");
        }

        // Safe null values
        if (user.getContact() == null) {
            user.setContact("");
        }

        if (user.getProfilePic() == null) {
            user.setProfilePic("");
        }

        return userRepository.save(user);
    }

    // =========================
    // LOCAL LOGIN
    // KEEPING YOUR ORIGINAL FLOW
    // =========================
    @PostMapping("/login")
    public Object loginUser(@RequestBody User loginRequest) {

        Optional<User> existingUser =
                userRepository.findByEmail(loginRequest.getEmail());

        if (existingUser.isPresent()) {

            User user = existingUser.get();

            if (user.getPassword() != null &&
                user.getPassword().equals(loginRequest.getPassword())) {

                return user;
            }
        }

        return "Invalid email or password";
    }

    // =========================
    // GOOGLE LOGIN / REGISTER
    // =========================
    @PostMapping("/google-login")
    public User googleLogin(@RequestBody User googleUser) {

        Optional<User> existingUser =
                userRepository.findByEmail(googleUser.getEmail());

        // =========================
        // EXISTING GOOGLE USER
        // =========================
        if (existingUser.isPresent()) {

            User user = existingUser.get();

            // Update profile pic
            if (googleUser.getProfilePic() != null &&
                !googleUser.getProfilePic().isEmpty()) {

                user.setProfilePic(googleUser.getProfilePic());
            }

            // Ensure provider
            user.setProvider("GOOGLE");

            // Safe null values
            if (user.getContact() == null) {
                user.setContact("");
            }

            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }

            return userRepository.save(user);
        }

        // =========================
        // NEW GOOGLE USER
        // =========================
        googleUser.setProvider("GOOGLE");

        if (googleUser.getRole() == null ||
            googleUser.getRole().isEmpty()) {

            googleUser.setRole("USER");
        }

        if (googleUser.getContact() == null) {
            googleUser.setContact("");
        }

        if (googleUser.getProfilePic() == null) {
            googleUser.setProfilePic("");
        }

        return userRepository.save(googleUser);
    }

    // =========================
    // GET ALL USERS (ADMIN)
    // =========================
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // =========================
    // UPDATE USER ROLE
    // FRONTEND:
    // PUT /users/{id}/role?role=ADMIN
    // =========================
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role
    ) {

        Optional<User> optionalUser =
                userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        if (role == null || role.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Role is required");
        }

        User user = optionalUser.get();

        user.setRole(role.toUpperCase());

        userRepository.save(user);

        return ResponseEntity.ok(
                "User role updated successfully"
        );
    }

    // =========================
    // DELETE USER
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ) {

        Optional<User> optionalUser =
                userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }
}