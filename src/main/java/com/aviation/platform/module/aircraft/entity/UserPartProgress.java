package com.aviation.platform.module.aircraft.entity;

import com.aviation.platform.module.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "user_part_progress")
public class UserPartProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "part_id", nullable = false)
    private CockpitPart part;

    @Column(nullable = false, length = 20)
    private String status = "LEARNED";

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected UserPartProgress() {
    }

    public UserPartProgress(User user, CockpitPart part) {
        this.user = user;
        this.part = part;
        this.status = "LEARNED";
        this.updatedAt = Instant.now();
    }

    public CockpitPart getPart() {
        return part;
    }
}
