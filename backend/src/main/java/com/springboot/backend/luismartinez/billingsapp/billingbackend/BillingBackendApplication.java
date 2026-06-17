package com.springboot.backend.luismartinez.billingsapp.billingbackend;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Role;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.User;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.config.OpenAiProperties;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Customer;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Product;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.CustomerRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.ProductRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.RoleRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@SpringBootApplication
@EnableConfigurationProperties(OpenAiProperties.class)
public class BillingBackendApplication {

	public static void main(String[] args) {

		SpringApplication.run(BillingBackendApplication.class, args);
	}

	@Component
	@Profile("!test")
	public static class DataInitializer implements CommandLineRunner {

		@Autowired
		private UserRepository userRepository;
		@Autowired private RoleRepository roleRepository;
		@Autowired private PasswordEncoder passwordEncoder;
		@Autowired private CustomerRepository customerRepository;
		@Autowired private ProductRepository productRepository;

		@Override
		public void run(String... args) {

			ensureRole("ROLE_OWNER");
			ensureRole("ROLE_ADMIN");
			ensureRole("ROLE_USER");

			if(userRepository.findByUsername("admin").isEmpty()){
				Role ownerRole = roleRepository.findByName("ROLE_OWNER").orElseThrow();
				Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
				Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

				User admin = new User();
				admin.setName("Admin");
				admin.setLastname("System");
				admin.setEmail("admin@mail.com");
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("1234"));
				admin.setRoles(List.of(ownerRole, adminRole, userRole));

				userRepository.save(admin);
				System.out.println(admin);
			} else {
				ensureOwnerAdminRoles();
			}

			seedCustomers();
			seedProducts();

		}

		private void ensureRole(String name) {
			if (roleRepository.findByName(name).isEmpty()) {
				roleRepository.save(new Role(null, name));
			}
		}

		private void ensureOwnerAdminRoles() {
			User admin = userRepository.findByUsername("admin").orElseThrow();
			Role ownerRole = roleRepository.findByName("ROLE_OWNER").orElseThrow();
			Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
			Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

			admin.setRoles(List.of(ownerRole, adminRole, userRole));
			userRepository.save(admin);
		}

		private void seedCustomers() {
			List<Customer> customers = List.of(
					customer("Sofia", "Weber", "sofia.weber@example.com", "Alexanderplatz 12, Berlin", "+49 30 1000 1001"),
					customer("Mateo", "Klein", "mateo.klein@example.com", "Kurfurstendamm 45, Berlin", "+49 30 1000 1002"),
					customer("Emma", "Schneider", "emma.schneider@example.com", "Leopoldstrasse 8, Munich", "+49 89 1000 1003"),
					customer("Lucas", "Fischer", "lucas.fischer@example.com", "Zeil 22, Frankfurt", "+49 69 1000 1004"),
					customer("Mia", "Hoffmann", "mia.hoffmann@example.com", "Konigsallee 17, Dusseldorf", "+49 211 1000 1005"),
					customer("Noah", "Meyer", "noah.meyer@example.com", "Reeperbahn 91, Hamburg", "+49 40 1000 1006"),
					customer("Lina", "Wagner", "lina.wagner@example.com", "Augustusplatz 4, Leipzig", "+49 341 1000 1007"),
					customer("Felix", "Becker", "felix.becker@example.com", "Schildergasse 33, Cologne", "+49 221 1000 1008"),
					customer("Clara", "Schulz", "clara.schulz@example.com", "Marktplatz 6, Stuttgart", "+49 711 1000 1009"),
					customer("Luis", "Zimmermann", "luis.zimmermann@example.com", "Bottcherstrasse 15, Bremen", "+49 421 1000 1010")
			);

			customers.stream()
					.filter(customer -> !customerRepository.existsByEmail(customer.getEmail()))
					.forEach(customerRepository::save);
		}

		private void seedProducts() {
			List<Product> products = List.of(
					product("Consultoria tecnica", "Servicio de consultoria por hora", "85.00", 120),
					product("Desarrollo backend", "Implementacion de APIs y servicios", "120.00", 80),
					product("Desarrollo frontend", "Pantallas Angular y componentes UI", "105.00", 95),
					product("Diseno de dashboard", "Dashboard administrativo personalizado", "450.00", 20),
					product("Mantenimiento mensual", "Soporte y mejoras mensuales", "750.00", 12),
					product("Integracion de pagos", "Conexion con pasarelas de pago", "980.00", 8),
					product("Auditoria de codigo", "Revision tecnica y reporte de mejoras", "650.00", 10),
					product("Configuracion Docker", "Contenedores y compose para despliegue", "390.00", 15),
					product("Generacion PDF", "Plantilla PDF para documentos", "280.00", 25),
					product("Automatizacion QA", "Pruebas automaticas y pipelines", "560.00", 18)
			);

			products.stream()
					.filter(product -> !productRepository.existsByName(product.getName()))
					.forEach(productRepository::save);
		}

		private Customer customer(String firstName, String lastName, String email, String address, String phone) {
			Customer customer = new Customer();
			customer.setFirstName(firstName);
			customer.setLastName(lastName);
			customer.setEmail(email);
			customer.setAddress(address);
			customer.setPhone(phone);
			return customer;
		}

		private Product product(String name, String description, String price, Integer stock) {
			Product product = new Product();
			product.setName(name);
			product.setDescription(description);
			product.setPrice(new BigDecimal(price));
			product.setStock(stock);
			return product;
		}
	}
}
