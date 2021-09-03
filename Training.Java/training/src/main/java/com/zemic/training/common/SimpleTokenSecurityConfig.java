package com.zemic.training.common;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.access.ExceptionTranslationFilter;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;


@Configuration
@EnableWebSecurity
@Order(1)
public class SimpleTokenSecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity httpSecurity) throws Exception
  {
      SimpleTokenHeaderFilter filter = new SimpleTokenHeaderFilter("AuthenticationToken");

      filter.setAuthenticationManager(new AuthenticationManager()
      {
          @Override
          public Authentication authenticate(Authentication authentication)
                  throws AuthenticationException
          {
              String principal = (String) authentication.getPrincipal();
              
              if(StringHelper.IsNullOrEmpty(principal))
              {
                  authentication.setAuthenticated(false);
              }
              authentication.setAuthenticated(true);
              return authentication;
          }
      });

      httpSecurity
              .csrf()
              .disable()
              .sessionManagement()
              .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
              .and()
              .addFilter(filter)
              .addFilterBefore(new ExceptionTranslationFilter(
                              new Http403ForbiddenEntryPoint()),
                      filter.getClass()
              )
              .authorizeRequests()
              .antMatchers("/api/login","/v2/api-docs","/configuration/ui","/swagger-resources/**","/configuration/security","/swagger-ui.html","/webjars/**").anonymous()
              .antMatchers("/api/**")
              .authenticated();
  }

}
