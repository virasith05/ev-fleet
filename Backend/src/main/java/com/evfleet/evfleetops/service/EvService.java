package com.evfleet.evfleetops.service;

import com.evfleet.evfleetops.model.Ev;
import com.evfleet.evfleetops.model.EvStatus;
import com.evfleet.evfleetops.repository.EvRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvService {

    private final EvRepository evRepository;

    public EvService(EvRepository evRepository) {
        this.evRepository = evRepository;
    }

    public List<Ev> getAllEvs() {
        return evRepository.findAll();
    }

    public Optional<Ev> getEvById(Long id) {
        return evRepository.findById(id);
    }

    public Ev createEv(Ev ev) {
        // some simple validation can be added later
        return evRepository.save(ev);
    }

    public Ev updateEv(Long id, Ev updatedEv) {
        return evRepository.findById(id)
                .map(existing -> {
                    existing.setRegistration(updatedEv.getRegistration());
                    existing.setModel(updatedEv.getModel());
                    existing.setBatteryCapacityKWh(updatedEv.getBatteryCapacityKWh());
                    existing.setCurrentBatteryPercent(updatedEv.getCurrentBatteryPercent());
                    existing.setStatus(updatedEv.getStatus());
                    existing.setLastKnownLatitude(updatedEv.getLastKnownLatitude());
                    existing.setLastKnownLongitude(updatedEv.getLastKnownLongitude());
                    existing.setLastSeenAt(updatedEv.getLastSeenAt());
                    return evRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("EV not found with id " + id));
    }

    public void deleteEv(Long id) {
        if (!evRepository.existsById(id)) {
            throw new RuntimeException("EV not found with id " + id);
        }
        evRepository.deleteById(id);
    }

    public List<Ev> getEvsByStatus(EvStatus status) {
        return evRepository.findByStatus(status);
    }
}
