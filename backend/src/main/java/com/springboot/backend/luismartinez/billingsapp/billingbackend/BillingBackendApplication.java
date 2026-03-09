package com.springboot.backend.luismartinez.billingsapp.billingbackend;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Role;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.User;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.RoleRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@SpringBootApplication
public class BillingBackendApplication {

	public static void main(String[] args) {

		SpringApplication.run(BillingBackendApplication.class, args);
	}

	@Component
	public static class DataInitializer implements CommandLineRunner {

		@Autowired
		private UserRepository userRepository;
		@Autowired private RoleRepository roleRepository;
		@Autowired private PasswordEncoder passwordEncoder;

		@Override
		public void run(String... args) {

			if(roleRepository.count()==0){
				roleRepository.save(new Role(null,"ROLE_ADMIN"));
				roleRepository.save(new Role(null,"ROLE_USER"));
			}

			if(userRepository.findByUsername("admin").isEmpty()){
				Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();

				User admin = new User();
				admin.setName("Admin");
				admin.setLastname("System");
				admin.setEmail("admin@mail.com");
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("1234"));
				admin.setRoles(List.of(adminRole));

				userRepository.save(admin);
				System.out.println(admin);
			}

		}
	}
}
