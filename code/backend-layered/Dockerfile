FROM openjdk:24-jdk-slim AS build
WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:24-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
