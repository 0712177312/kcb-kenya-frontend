package com.compulynx.compas.security;
//https://panlw.github.io/15359384213292.html

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	CustomAuthenticationProvider customAuthenticationProvider;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable().authorizeRequests().antMatchers("/", "/ping","/rest/v1/dashboard/configs").permitAll()
				.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.antMatchers(HttpMethod.GET, "/*.js","/*.woff","/*.ttf", "/*.woff2", "/*.png").permitAll()
				.antMatchers(HttpMethod.GET, "/assets/**").permitAll()
				.antMatchers(HttpMethod.POST, "/login").permitAll().anyRequest().authenticated().and()
				// We filter the api/login requests
				.addFilterBefore(new JWTLoginFilter("/login", authenticationManager()),
						UsernamePasswordAuthenticationFilter.class)
				// And filter other requests to check the presence of JWT in header
				.addFilterBefore(new JWTAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		// Create a default account
		auth.inMemoryAuthentication().withUser("admin").password(passwordEncoder().encode("$2a$10$/1vNtYBNkd.T.lYyoiAjV.VqJ44EHhBR3/deKHYncmj5pjkUujg0u")).roles("ADMIN");
		auth.authenticationProvider(customAuthenticationProvider);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
