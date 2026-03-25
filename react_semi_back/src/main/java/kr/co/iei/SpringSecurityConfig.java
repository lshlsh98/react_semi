package kr.co.iei;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {
	
	@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
        .csrf(csrf -> csrf.disable()) // 필요 시 비활성화
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll() // 모든 요청 허용
        )
        .formLogin(form -> form.disable()) // 로그인 폼 비활성화 (선택)
        .httpBasic(basic -> basic.disable()); // 기본 인증 비활성화 (선택)

        return http.build();
    }//
	
	// 비밀번호 암호와에 사용 할 객체를 서버 시작 시 미리 생성
	@Bean 
	public BCryptPasswordEncoder bCrypt() {
		return new BCryptPasswordEncoder();
	}//
}
