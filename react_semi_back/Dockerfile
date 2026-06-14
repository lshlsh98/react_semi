# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# 의존성 캐시 레이어 (pom.xml 변경 시에만 재다운로드)
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 9999

ENTRYPOINT ["java", "-jar", "app.jar"]
