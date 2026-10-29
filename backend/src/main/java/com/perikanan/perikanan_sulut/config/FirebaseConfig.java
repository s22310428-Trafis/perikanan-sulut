package com.perikanan.perikanan_sulut.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Konfigurasi Terpusat Firebase Admin SDK dan Cloud Firestore
 */
@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.credential.path:firebase/serviceAccountKey.json}")
    private String credentialPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        InputStream serviceAccountStream = resolveCredentialInputStream();

        if (serviceAccountStream == null) {
            log.warn("PERINGATAN: File credential Firebase tidak ditemukan di path: {}. Mencoba menggunakan Application Default Credentials...", credentialPath);
            try {
                FirebaseOptions defaultOptions = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
                return FirebaseApp.initializeApp(defaultOptions);
            } catch (Exception ex) {
                log.error("Gagal menginisialisasi Google Application Default Credentials: {}", ex.getMessage());
                throw new IllegalStateException("Credential Firebase tidak tersedia. Pastikan firebase/serviceAccountKey.json ada di folder backend.", ex);
            }
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                .build();

        FirebaseApp app = FirebaseApp.initializeApp(options);
        log.info("FirebaseApp berhasil diinisialisasi secara aman.");
        return app;
    }

    @Bean
    public Firestore firestore(FirebaseApp firebaseApp) {
        Firestore firestore = FirestoreClient.getFirestore(firebaseApp);
        log.info("Cloud Firestore Client berhasil dikonfigurasi.");
        return firestore;
    }

    /**
     * Menyelesaikan InputStream credential secara aman dari file path fisik, classpath, atau env var.
     */
    private InputStream resolveCredentialInputStream() {
        // 1. Cek Environment variable FIREBASE_CONFIG_PATH
        String envPath = System.getenv("FIREBASE_CONFIG_PATH");
        if (envPath != null && !envPath.isBlank()) {
            File envFile = new File(envPath);
            if (envFile.exists() && envFile.isFile()) {
                try {
                    log.info("Memuat credential Firebase dari environment variable FIREBASE_CONFIG_PATH");
                    return new FileInputStream(envFile);
                } catch (IOException e) {
                    log.warn("Gagal membuka file credential dari FIREBASE_CONFIG_PATH: {}", e.getMessage());
                }
            }
        }

        // 2. Cek File fisik relatif terhadap direktori kerja aplikasi
        File file = new File(credentialPath);
        if (file.exists() && file.isFile()) {
            try {
                log.info("Memuat credential Firebase dari file: {}", file.getAbsolutePath());
                return new FileInputStream(file);
            } catch (IOException e) {
                log.warn("Gagal membaca file credential: {}", e.getMessage());
            }
        }

        // 3. Cek relatif terhadap root repo (misal parent folder) jika dijalankan dari subfolder
        File parentRelativeFile = new File("backend/" + credentialPath);
        if (parentRelativeFile.exists() && parentRelativeFile.isFile()) {
            try {
                log.info("Memuat credential Firebase dari root path: {}", parentRelativeFile.getAbsolutePath());
                return new FileInputStream(parentRelativeFile);
            } catch (IOException e) {
                log.warn("Gagal membaca file credential: {}", e.getMessage());
            }
        }

        // 4. Cek Classpath resource
        try {
            ClassPathResource classPathResource = new ClassPathResource(credentialPath);
            if (classPathResource.exists()) {
                log.info("Memuat credential Firebase dari classpath resource: {}", credentialPath);
                return classPathResource.getInputStream();
            }
        } catch (IOException ignored) {
        }

        return null;
    }
}
