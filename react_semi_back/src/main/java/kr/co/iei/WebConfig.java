package kr.co.iei;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
	
	@Value("${file.root}")
	private String root;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		/*
		registry 
			.addResourceHandler("/editor/**")						// 요청 패턴
			.addResourceLocations("file:///" + root + "editor/");	// 실제 경로
		
		registry
			.addResourceHandler("/member/thumb/**") 				// 요청 패턴
			.addResourceLocations("file:///" + root + "member/"); 	// 실제 경로
		*/
	}//

}
