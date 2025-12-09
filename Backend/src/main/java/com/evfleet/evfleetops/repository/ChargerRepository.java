package com.evfleet.evfleetops.repository;

import com.evfleet.evfleetops.model.Charger;
import com.evfleet.evfleetops.model.ChargerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChargerRepository extends JpaRepository<Charger, Long> {

    List<Charger> findByStatus(ChargerStatus status);
}
