package com.example.testApp.service;

import com.example.testApp.model.TextDocument;
import com.example.testApp.repository.TextDocumentRepository;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
public class TextDocumentService {

    private final TextDocumentRepository repository;
    private final ElasticsearchOperations esOps;

    public TextDocumentService(TextDocumentRepository repository, ElasticsearchOperations esOps) {
        this.repository = repository;
        this.esOps = esOps;
    }

    public TextDocument create(TextDocument doc) {
        doc.setCreatedAt(LocalDateTime.now());
        return repository.save(doc);
    }

    public Optional<TextDocument> findById(String id) {
        return repository.findById(id);
    }

    public List<TextDocument> findAll() {
        return StreamSupport.stream(repository.findAll().spliterator(), false).toList();
    }

    public Optional<TextDocument> update(String id, TextDocument updated) {
        return repository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setContent(updated.getContent());
            return repository.save(existing);
        });
    }

    public boolean delete(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<TextDocument> search(String term) {
        Query query = NativeQuery.builder()
                .withQuery(q -> q.multiMatch(m -> m
                        .query(term)
                        .fields("title", "content")
                ))
                .build();

        SearchHits<TextDocument> hits = esOps.search(query, TextDocument.class);
        return hits.getSearchHits().stream()
                .map(hit -> hit.getContent())
                .toList();
    }
}
