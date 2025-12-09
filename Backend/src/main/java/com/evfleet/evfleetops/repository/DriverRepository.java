package com.evfleet.evfleetops.repository;

import com.evfleet.evfleetops.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    List<Driver> findByActive(boolean active);
}
