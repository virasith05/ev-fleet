package com.evfleet.evfleetops.service;

import com.evfleet.evfleetops.model.Charger;
import com.evfleet.evfleetops.model.ChargerStatus;
import com.evfleet.evfleetops.repository.ChargerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChargerService {

    private final ChargerRepository chargerRepository;

    public ChargerService(ChargerRepository chargerRepository) {
        this.chargerRepository = chargerRepository;
    }

    public List<Charger> getAllChargers() {
        return chargerRepository.findAll();
    }

    public Optional<Charger> getChargerById(Long id) {
        return chargerRepository.findById(id);
    }

    public Charger createCharger(Charger charger) {
        return chargerRepository.save(charger);
    }

    public Charger updateCharger(Long id, Charger updated) {
        return chargerRepository.findById(id)
                .map(existing -> {
                    existing.setLocationName(updated.getLocationName());
                    existing.setMaxPowerKW(updated.getMaxPowerKW());
                    existing.setStatus(updated.getStatus());
                    return chargerRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Charger not found with id " + id));
    }

    public void deleteCharger(Long id) {
        if (!chargerRepository.existsById(id)) {
            throw new RuntimeException("Charger not found with id " + id);
        }
        chargerRepository.deleteById(id);
    }

    public List<Charger> getChargersByStatus(ChargerStatus status) {
        return chargerRepository.findByStatus(status);
    }
}
