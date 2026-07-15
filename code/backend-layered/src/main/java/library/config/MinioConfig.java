package library.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(accessKey, secretKey)
                .build();
    }

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Bean
    public org.springframework.boot.CommandLineRunner initBucketPolicy(MinioClient minioClient) {
        return args -> {
            try {
                boolean found = minioClient.bucketExists(io.minio.BucketExistsArgs.builder().bucket(bucketName).build());
                if (!found) {
                    minioClient.makeBucket(io.minio.MakeBucketArgs.builder().bucket(bucketName).build());
                }
                String policy = "{\n" +
                        "  \"Statement\": [\n" +
                        "    {\n" +
                        "      \"Action\": \"s3:GetObject\",\n" +
                        "      \"Effect\": \"Allow\",\n" +
                        "      \"Principal\": \"*\",\n" +
                        "      \"Resource\": \"arn:aws:s3:::" + bucketName + "/*\"\n" +
                        "    }\n" +
                        "  ],\n" +
                        "  \"Version\": \"2012-10-17\"\n" +
                        "}";
                minioClient.setBucketPolicy(
                        io.minio.SetBucketPolicyArgs.builder().bucket(bucketName).config(policy).build());
            } catch (Exception e) {
                System.err.println("Error initializing MinIO bucket policy: " + e.getMessage());
            }
        };
    }
}
