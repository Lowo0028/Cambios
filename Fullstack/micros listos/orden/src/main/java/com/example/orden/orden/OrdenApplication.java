package com.example.orden.orden;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class OrdenApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrdenApplication.class, args);
	}
}