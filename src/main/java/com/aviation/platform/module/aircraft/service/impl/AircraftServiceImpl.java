package com.aviation.platform.module.aircraft.service.impl;

import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.aircraft.dto.AircraftResponse;
import com.aviation.platform.module.aircraft.dto.FlightInstruments;
import com.aviation.platform.module.aircraft.dto.LearnActionRequest;
import com.aviation.platform.module.aircraft.dto.PartResponse;
import com.aviation.platform.module.aircraft.dto.SessionResponse;
import com.aviation.platform.module.aircraft.dto.SimActionRequest;
import com.aviation.platform.module.aircraft.dto.SimulationResponse;
import com.aviation.platform.module.aircraft.entity.CockpitPart;
import com.aviation.platform.module.aircraft.entity.SimulationSession;
import com.aviation.platform.module.aircraft.entity.TrainingSimulation;
import com.aviation.platform.module.aircraft.entity.UserPartProgress;
import com.aviation.platform.module.aircraft.repository.AircraftRepository;
import com.aviation.platform.module.aircraft.repository.CockpitPartRepository;
import com.aviation.platform.module.aircraft.repository.SimulationSessionRepository;
import com.aviation.platform.module.aircraft.repository.TrainingSimulationRepository;
import com.aviation.platform.module.aircraft.repository.UserPartProgressRepository;
import com.aviation.platform.module.aircraft.service.AircraftService;
import com.aviation.platform.module.aircraft.service.SimulationEngine;
import com.aviation.platform.module.user.entity.User;
import com.aviation.platform.module.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class AircraftServiceImpl implements AircraftService {

    private final AircraftRepository aircraftRepository;
    private final CockpitPartRepository partRepository;
    private final UserPartProgressRepository progressRepository;
    private final TrainingSimulationRepository simulationRepository;
    private final SimulationSessionRepository sessionRepository;
    private final UserRepository userRepository;

    public AircraftServiceImpl(
            AircraftRepository aircraftRepository,
            CockpitPartRepository partRepository,
            UserPartProgressRepository progressRepository,
            TrainingSimulationRepository simulationRepository,
            SimulationSessionRepository sessionRepository,
            UserRepository userRepository
    ) {
        this.aircraftRepository = aircraftRepository;
        this.partRepository = partRepository;
        this.progressRepository = progressRepository;
        this.simulationRepository = simulationRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AircraftResponse> list(CurrentUser actor) {
        return aircraftRepository.findAllByOrderBySortIndexAsc().stream()
                .map(a -> AircraftResponse.from(
                        a,
                        partRepository.countByAircraftCode(a.getCode()),
                        actor == null ? null : progressRepository.countLearned(actor.id(), a.getCode())
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PartResponse> parts(String aircraftCode, CurrentUser actor) {
        Set<Long> learned = learnedIds(actor, aircraftCode);
        return partRepository.findByAircraftCodeOrderBySortIndexAsc(aircraftCode).stream()
                .map(p -> PartResponse.from(p, learned.contains(p.getId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PartResponse nextLesson(String aircraftCode, CurrentUser actor) {
        Set<Long> learned = learnedIds(actor, aircraftCode);
        return partRepository.findByAircraftCodeOrderBySortIndexAsc(aircraftCode).stream()
                .filter(p -> !learned.contains(p.getId()))
                .findFirst()
                .map(p -> PartResponse.from(p, false))
                .orElseThrow(() -> ApiException.notFound("Tüm tuşlar öğrenildi"));
    }

    @Override
    public PartResponse learn(String aircraftCode, LearnActionRequest request, CurrentUser actor) {
        PartResponse expected = nextLesson(aircraftCode, actor);
        if (!expected.code().equals(request.selectedPartCode())) {
            throw ApiException.badRequest("Yanlış tuş. Beklenen: " + expected.nameTr() + " (" + expected.panel() + ")");
        }
        CockpitPart part = partRepository.findByCode(expected.code()).orElseThrow();
        User user = userRepository.findById(actor.id()).orElseThrow(() -> ApiException.notFound("User not found"));
        if (progressRepository.findByUserIdAndPartId(actor.id(), part.getId()).isEmpty()) {
            progressRepository.save(new UserPartProgress(user, part));
        }
        return PartResponse.from(part, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SimulationResponse> simulations(String aircraftCode) {
        return simulationRepository.findByAircraftCodeOrderByIdAsc(aircraftCode).stream()
                .map(SimulationResponse::from)
                .toList();
    }

    @Override
    public SessionResponse startSim(Long simulationId, CurrentUser actor) {
        TrainingSimulation sim = simulationRepository.findById(simulationId)
                .orElseThrow(() -> ApiException.notFound("Simülasyon yok"));
        User user = userRepository.findById(actor.id()).orElseThrow(() -> ApiException.notFound("User not found"));
        Map<String, Object> state = SimulationEngine.seed(sim.getConfig());
        SimulationSession session = sessionRepository.save(new SimulationSession(user, sim, state));
        session.setLastMessage(String.valueOf(state.getOrDefault("message", "")));
        return toSession(session, sim);
    }

    @Override
    public SessionResponse act(Long sessionId, SimActionRequest request, CurrentUser actor) {
        SimulationSession session = sessionRepository.findByIdWithSim(sessionId)
                .orElseThrow(() -> ApiException.notFound("Oturum yok"));
        if (!session.getSimulation().getAircraft().getCode().equals(
                partRepository.findByCode(request.partCode()).map(p -> p.getAircraft().getCode()).orElse(""))) {
            throw ApiException.badRequest("Bu parça bu uçağa ait değil");
        }
        if (!"IN_PROGRESS".equals(session.getStatus())) {
            throw ApiException.invalidState("Oturum bitti: " + session.getStatus());
        }
        Map<String, Object> next = SimulationEngine.apply(
                session.getSimulation().getConfig(),
                session.getState(),
                request.partCode(),
                request.value()
        );
        String status = String.valueOf(next.getOrDefault("status", "IN_PROGRESS"));
        session.setState(next);
        session.setStatus(status);
        session.setLastMessage(String.valueOf(next.getOrDefault("message", "")));
        return toSession(session, session.getSimulation());
    }

    private Set<Long> learnedIds(CurrentUser actor, String code) {
        if (actor == null) {
            return Set.of();
        }
        // countLearned is enough for list; for ids we scan parts+progress
        List<CockpitPart> parts = partRepository.findByAircraftCodeOrderBySortIndexAsc(code);
        Set<Long> ids = new HashSet<>();
        for (CockpitPart part : parts) {
            if (progressRepository.findByUserIdAndPartId(actor.id(), part.getId()).isPresent()) {
                ids.add(part.getId());
            }
        }
        return ids;
    }

    @SuppressWarnings("unchecked")
    private SessionResponse toSession(SimulationSession session, TrainingSimulation sim) {
        Map<String, Object> state = session.getState();
        int cursor = state.get("cursor") instanceof Number n ? n.intValue() : 0;
        List<?> expected = (List<?>) sim.getConfig().getOrDefault("expected", List.of());
        Map<String, Object> controls = state.get("controls") instanceof Map<?, ?> m ? (Map<String, Object>) m : Map.of();
        boolean open = "IN_PROGRESS".equals(session.getStatus());
        return new SessionResponse(
                session.getId(),
                session.getStatus(),
                session.getLastMessage() == null ? String.valueOf(state.getOrDefault("message", "")) : session.getLastMessage(),
                SimulationEngine.currentHint(sim.getConfig(), cursor),
                controls,
                cursor,
                expected.size(),
                FlightInstruments.from(state.get("flight")),
                open ? SimulationEngine.expectedPart(sim.getConfig(), cursor) : null,
                open ? SimulationEngine.expectedValue(sim.getConfig(), cursor) : null
        );
    }
}
