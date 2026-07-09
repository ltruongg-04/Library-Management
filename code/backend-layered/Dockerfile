FROM eclipse-temurin:24-jdk-noble AS build
WORKDIR /workspace

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

COPY . .

RUN set -eux; \
    if [ -f pom.xml ]; then \
        project_dir="."; \
    elif [ -f code/backend-layered/pom.xml ]; then \
        project_dir="code/backend-layered"; \
    else \
        echo "Could not find backend pom.xml in Docker build context"; \
        exit 1; \
    fi; \
    cd "$project_dir"; \
    mvn clean package -DskipTests; \
    cp target/*.jar /tmp/app.jar

# Run stage
FROM eclipse-temurin:24-jre-noble
WORKDIR /app
COPY --from=build /tmp/app.jar app.jar
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["./docker-entrypoint.sh"]
