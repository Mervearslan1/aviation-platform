package com.aviation.platform.module.aircraft.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "aircraft")
public class Aircraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 16)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 40)
    private String manufacturer;

    @Column(columnDefinition = "TEXT")
    private String philosophy;

    @Column(nullable = false, length = 20)
    private String difficulty = "BEGINNER";

    @Column(name = "sort_index", nullable = false)
    private int sortIndex;

    protected Aircraft() {
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public String getPhilosophy() {
        return philosophy;
    }

    public String getDifficulty() {
        return difficulty == null ? "BEGINNER" : difficulty;
    }
}
