package com.alp;

import org.testcontainers.DockerClientFactory;

public final class DockerAvailability {

    private DockerAvailability() {
    }

    public static boolean isAvailable() {
        try {
            return DockerClientFactory.instance().isDockerAvailable();
        } catch (Throwable ignored) {
            return false;
        }
    }
}
