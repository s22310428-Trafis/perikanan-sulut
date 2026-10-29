package com.perikanan.perikanan_sulut.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.perikanan.perikanan_sulut.model.HasilProduksi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * Repository untuk operasi CRUD data pada koleksi Cloud Firestore: hasil_produksi
 */
@Repository
public class HasilProduksiRepository {

    private static final Logger log = LoggerFactory.getLogger(HasilProduksiRepository.class);
    public static final String COLLECTION_NAME = "hasil_produksi";

    private final Firestore firestore;

    public HasilProduksiRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    private CollectionReference getCollection() {
        return firestore.collection(COLLECTION_NAME);
    }

    /**
     * Menyimpan data hasil produksi baru ke Firestore.
     * Jika ID belum diset, ID unik otomatis di-generate oleh Firestore.
     */
    public HasilProduksi save(HasilProduksi produksi) throws ExecutionException, InterruptedException {
        DocumentReference docRef;
        if (produksi.getId() == null || produksi.getId().isBlank()) {
            docRef = getCollection().document();
            produksi.setId(docRef.getId());
        } else {
            docRef = getCollection().document(produksi.getId());
        }

        if (produksi.getCreatedAt() == null) {
            produksi.setCreatedAt(new Date());
        }
        produksi.setUpdatedAt(new Date());

        ApiFuture<WriteResult> future = docRef.set(produksi);
        future.get(); // Tunggu hingga penulisan selesai
        log.info("Data produksi berhasil disimpan ke Firestore dengan ID: {}", produksi.getId());
        return produksi;
    }

    /**
     * Mencari data produksi berdasarkan ID dokumen.
     */
    public Optional<HasilProduksi> findById(String id) throws ExecutionException, InterruptedException {
        if (id == null || id.isBlank()) {
            return Optional.empty();
        }

        DocumentReference docRef = getCollection().document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            HasilProduksi hasil = document.toObject(HasilProduksi.class);
            if (hasil != null) {
                hasil.setId(document.getId());
                return Optional.of(hasil);
            }
        }
        return Optional.empty();
    }

    /**
     * Memeriksa keberadaan dokumen berdasarkan ID.
     */
    public boolean existsById(String id) throws ExecutionException, InterruptedException {
        return findById(id).isPresent();
    }

    /**
     * Mengambil seluruh data produksi dari koleksi.
     */
    public List<HasilProduksi> findAll() throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = getCollection().get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<HasilProduksi> results = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            HasilProduksi item = doc.toObject(HasilProduksi.class);
            if (item != null) {
                item.setId(doc.getId());
                results.add(item);
            }
        }

        // Urutkan berdasarkan tanggal produksi terbaru (descending)
        results.sort((a, b) -> {
            String dateA = a.getTanggalProduksi() != null ? a.getTanggalProduksi() : "";
            String dateB = b.getTanggalProduksi() != null ? b.getTanggalProduksi() : "";
            return dateB.compareTo(dateA);
        });

        return results;
    }

    /**
     * Memperbarui dokumen data produksi yang sudah ada.
     */
    public HasilProduksi update(String id, HasilProduksi produksi) throws ExecutionException, InterruptedException {
        produksi.setId(id);
        produksi.setUpdatedAt(new Date());

        DocumentReference docRef = getCollection().document(id);
        ApiFuture<WriteResult> future = docRef.set(produksi, SetOptions.merge());
        future.get();
        log.info("Data produksi dengan ID: {} berhasil diperbarui di Firestore.", id);
        return produksi;
    }

    /**
     * Menghapus dokumen data produksi berdasarkan ID.
     */
    public boolean deleteById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = getCollection().document(id);
        ApiFuture<DocumentSnapshot> checkFuture = docRef.get();
        if (!checkFuture.get().exists()) {
            return false;
        }

        ApiFuture<WriteResult> deleteFuture = docRef.delete();
        deleteFuture.get();
        log.info("Data produksi dengan ID: {} berhasil dihapus dari Firestore.", id);
        return true;
    }

    /**
     * Pencarian fleksibel berdasarkan keyword terhadap jenisIkan, namaNelayan, atau lokasiProduksi.
     */
    public List<HasilProduksi> search(String keyword) throws ExecutionException, InterruptedException {
        if (keyword == null || keyword.trim().isEmpty()) {
            return findAll();
        }

        String lowerKey = keyword.trim().toLowerCase();
        return findAll().stream()
                .filter(item ->
                        (item.getJenisIkan() != null && item.getJenisIkan().toLowerCase().contains(lowerKey)) ||
                        (item.getNamaNelayan() != null && item.getNamaNelayan().toLowerCase().contains(lowerKey)) ||
                        (item.getLokasiProduksi() != null && item.getLokasiProduksi().toLowerCase().contains(lowerKey))
                )
                .collect(Collectors.toList());
    }

    /**
     * Filter data produksi berdasarkan jenis ikan, lokasi, dan rentang tanggal produksi.
     */
    public List<HasilProduksi> filter(String jenisIkan, String lokasiProduksi, String startDate, String endDate)
            throws ExecutionException, InterruptedException {
        List<HasilProduksi> all = findAll();

        return all.stream()
                .filter(item -> {
                    if (jenisIkan != null && !jenisIkan.isBlank()) {
                        if (item.getJenisIkan() == null || !item.getJenisIkan().equalsIgnoreCase(jenisIkan.trim())) {
                            return false;
                        }
                    }
                    if (lokasiProduksi != null && !lokasiProduksi.isBlank()) {
                        if (item.getLokasiProduksi() == null || !item.getLokasiProduksi().toLowerCase().contains(lokasiProduksi.trim().toLowerCase())) {
                            return false;
                        }
                    }
                    if (startDate != null && !startDate.isBlank()) {
                        if (item.getTanggalProduksi() == null || item.getTanggalProduksi().compareTo(startDate.trim()) < 0) {
                            return false;
                        }
                    }
                    if (endDate != null && !endDate.isBlank()) {
                        if (item.getTanggalProduksi() == null || item.getTanggalProduksi().compareTo(endDate.trim()) > 0) {
                            return false;
                        }
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }
}
