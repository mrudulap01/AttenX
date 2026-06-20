# Stage 1: Build the Application
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy maven executable and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable and download dependencies
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Package the application
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the Application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the generated JAR
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
