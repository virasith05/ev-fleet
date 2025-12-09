package com.evfleet.evfleetops.repository;

import com.evfleet.evfleetops.model.EvTelemetry;
import com.evfleet.evfleetops.model.Ev;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvTelemetryRepository extends JpaRepository<EvTelemetry, Long> {

    List<EvTelemetry> findByEvOrderByTimestampDesc(Ev ev);
}
