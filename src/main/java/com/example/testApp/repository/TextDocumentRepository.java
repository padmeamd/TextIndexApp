package com.example.testApp.repository;

import com.example.testApp.model.TextDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface TextDocumentRepository extends ElasticsearchRepository<TextDocument, String> {
}
