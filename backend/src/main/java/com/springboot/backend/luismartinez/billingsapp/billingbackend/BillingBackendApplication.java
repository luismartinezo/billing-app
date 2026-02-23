package com.springboot.backend.luismartinez.billingsapp.billingbackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BillingBackendApplication {

	public static void main(String[] args) {

		SpringApplication.run(BillingBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner test(PasswordEncoder encoder){
		return args -> {
			System.out.println(encoder.encode("1234"));
		};
	}
}
