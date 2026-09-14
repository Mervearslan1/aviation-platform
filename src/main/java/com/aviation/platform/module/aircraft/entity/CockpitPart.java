package com.aviation.platform.module.aircraft.entity;

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
@Table(name = "cockpit_parts")
public class CockpitPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "aircraft_id", nullable = false)
    private Aircraft aircraft;

    @Column(nullable = false, unique = true, length = 32)
    private String code;

    @Column(nullable = false, length = 80)
    private String panel;

    @Column(name = "name_en", nullable = false, length = 200)
    private String nameEn;

    @Column(name = "name_tr", nullable = false, length = 200)
    private String nameTr;

    @Column(nullable = false, length = 240)
    private String location;

    @Column(name = "function_tr", nullable = false, columnDefinition = "TEXT")
    private String functionTr;

    @Column(nullable = false, length = 64)
    private String category;

    @Column(name = "sort_index", nullable = false)
    private int sortIndex;

    protected CockpitPart() {
    }

    public Long getId() {
        return id;
    }

    public Aircraft getAircraft() {
        return aircraft;
    }

    public String getCode() {
        return code;
    }

    public String getPanel() {
        return panel;
    }

    public String getNameEn() {
        return nameEn;
    }

    public String getNameTr() {
        return nameTr;
    }

    public String getLocation() {
        return location;
    }

    public String getFunctionTr() {
        return functionTr;
    }

    public String getCategory() {
        return category;
    }

    public int getSortIndex() {
        return sortIndex;
    }
}
