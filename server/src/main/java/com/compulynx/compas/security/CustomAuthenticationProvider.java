package com.compulynx.compas.security;

import java.util.Collections;

import com.compulynx.compas.models.ApiSecurity;
import com.compulynx.compas.repositories.ApiSecurityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;


@Service
public class CustomAuthenticationProvider implements AuthenticationProvider {
	@Autowired
	ApiSecurityRepository tbapisecurityRepository;
	@Override
	public Authentication authenticate(Authentication auth) throws AuthenticationException {
		String username = auth.getName();
		String password = auth.getCredentials().toString();
		System.out.println("Error:: "+password);
		ApiSecurity tbapisecurity = tbapisecurityRepository.Authenticate(username, password);
		if (tbapisecurity == null) {
			throw new BadCredentialsException("External system authentication failed");
		} else {
			return new UsernamePasswordAuthenticationToken(username, password, Collections.emptyList());
		}
	}

	@Override
	public boolean supports(Class<?> auth) {
		return auth.equals(UsernamePasswordAuthenticationToken.class);
	}

}
