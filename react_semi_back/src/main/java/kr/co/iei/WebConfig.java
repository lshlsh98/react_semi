package kr.co.iei;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // 이미지 파일은 AWS S3에서 직접 서빙하므로 로컬 정적 리소스 핸들러 불필요
}
