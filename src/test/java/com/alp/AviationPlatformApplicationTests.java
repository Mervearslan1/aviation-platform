package com.alp;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@EnabledIf("com.alp.DockerAvailability#isAvailable")
class AviationPlatformApplicationTests {

	@Test
	void contextLoads() {
	}

}
