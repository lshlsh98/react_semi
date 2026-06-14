package kr.co.iei.utils;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Component
public class FileUtils {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.s3.region}")
    private String region;

    public FileUtils(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * S3에 파일을 업로드하고 전체 URL을 반환합니다.
     * @param folder S3 내 폴더명 (예: "market", "semi", "editor")
     * @param file   업로드할 파일
     * @return S3 파일 URL
     */
    public String upload(String folder, MultipartFile file) {
        String filename = file.getOriginalFilename();
        int dotIndex = filename.lastIndexOf(".");
        String extension = dotIndex != -1 ? filename.substring(dotIndex) : "";

        String uuid = UUID.randomUUID().toString();
        String key = folder + "/" + uuid + extension;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
    }

    /**
     * S3에서 파일을 삭제합니다.
     * @param s3Url 삭제할 파일의 전체 S3 URL
     * @return 삭제 성공 여부
     */
    public boolean deleteFile(String s3Url) {
        if (s3Url == null || s3Url.isEmpty()) return false;

        try {
            String marker = ".amazonaws.com/";
            int idx = s3Url.indexOf(marker);
            if (idx == -1) return false;

            String key = s3Url.substring(idx + marker.length());

            DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

            s3Client.deleteObject(request);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
