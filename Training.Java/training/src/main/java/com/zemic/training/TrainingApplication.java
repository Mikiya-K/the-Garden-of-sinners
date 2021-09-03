package com.zemic.training;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.web.bind.annotation.RestController;

import com.zemic.training.common.CommonConfiguration;
import com.zemic.training.logic.LogicConfiguration;
import com.zemic.training.repository.RepositoryConfiguration;

@SpringBootApplication
@RestController
@Import({RepositoryConfiguration.class,
    CommonConfiguration.class,
    LogicConfiguration.class
    })
public class TrainingApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrainingApplication.class, args);
	}

}
