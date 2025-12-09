package com.evfleet.evfleetops.repository;

import com.evfleet.evfleetops.model.Ev;
import com.evfleet.evfleetops.model.EvStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvRepository extends JpaRepository<Ev, Long> {

    List<Ev> findByStatus(EvStatus status);

}
