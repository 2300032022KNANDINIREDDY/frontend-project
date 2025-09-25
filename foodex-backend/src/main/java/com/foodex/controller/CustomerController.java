package com.foodex.controller;

import com.foodex.model.OrderEntity;
import com.foodex.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/order")
    public ResponseEntity<?> placeOrder(@RequestBody OrderEntity order) {
        order.setStatus("PENDING");
        OrderEntity saved = orderRepository.save(order);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
