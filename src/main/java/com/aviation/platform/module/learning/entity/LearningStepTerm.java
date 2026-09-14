package com.aviation.platform.module.learning.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "learning_step_terms")
public class LearningStepTerm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    private LearningStep step;

    @Column(nullable = false, length = 120)
    private String term;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String meaning;

    @Column(name = "sort_index", nullable = false)
    private int sortIndex;

    protected LearningStepTerm() {
    }

    public Long getId() {
        return id;
    }

    public LearningStep getStep() {
        return step;
    }

    public String getTerm() {
        return term;
    }

    public String getMeaning() {
        return meaning;
    }

    public int getSortIndex() {
        return sortIndex;
    }
}
