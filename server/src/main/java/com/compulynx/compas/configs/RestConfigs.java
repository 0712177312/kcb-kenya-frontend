package com.compulynx.compas.configs;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RestConfigs extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response,
                                    final FilterChain filterChain) throws ServletException, IOException {

        response.addHeader("Access-Control-Allow-Methods", "GET, POST");
        response.addHeader("Access-Control-Max-Age", "3600");
        response.addHeader("Access-Control-Allow-Headers","Origin, Content-Type, Accept, Authorization, X-Requested-With, timeout, Access-Control-Expose-Headers");
        // Added HTTP headers for security vulnerability
        response.addHeader("Access-Control-Allow-Origin","*");
        response.addHeader("X-Frame-Options","");
        if (request.isSecure()) {
            response.addHeader("Strict-Transport-Security","max-age=31536000; includeSubDomains");
        }
        response.addHeader("X-Content-Type-Options","nosniff");
        response.addHeader("X-XSS-Protection","1; mode=block");
        response.addHeader("Cache-Control","no-store");
        response.addHeader("Pragma"," no-cache");
        // For HTTP OPTIONS verb/method reply with ACCEPTED status code -- per CORS
        // handshake
        if (request.getMethod().equals("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_ACCEPTED);
            return;
        }
        response.addHeader("Access-Control-Expose-Headers", "*");
        response.addHeader("Access-Control-Allow-Credentials", "true");
        filterChain.doFilter(request, response);
    }
}
