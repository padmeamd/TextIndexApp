package com.example.testApp.controller;

import com.example.testApp.model.TextDocument;
import com.example.testApp.service.TextDocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/texts")
public class TextDocumentController {

    private final TextDocumentService service;

    public TextDocumentController(TextDocumentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TextDocument> create(@RequestBody TextDocument doc) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(doc));
    }

    @GetMapping
    public List<TextDocument> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TextDocument> findById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TextDocument> update(@PathVariable String id, @RequestBody TextDocument doc) {
        return service.update(id, doc)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return service.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public List<TextDocument> search(@RequestParam String q) {
        return service.search(q);
    }
}
