package com.perikanan.perikanan_sulut.service;

import com.perikanan.perikanan_sulut.dto.ProduksiRequest;
import com.perikanan.perikanan_sulut.dto.ProduksiResponse;
import com.perikanan.perikanan_sulut.exception.ResourceNotFoundException;
import com.perikanan.perikanan_sulut.model.HasilProduksi;
import com.perikanan.perikanan_sulut.repository.HasilProduksiRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Layer untuk Pengelolaan Data Hasil Produksi Perikanan
 */
@Service
public class HasilProduksiService {

    private static final Logger log = LoggerFactory.getLogger(HasilProduksiService.class);

    private final HasilProduksiRepository repository;

    public HasilProduksiService(HasilProduksiRepository repository) {
        this.repository = repository;
    }

    /**
     * Menghitung total nilai secara otomatis: jumlahProduksi × hargaPerKg
     */
    public Double hitungTotalNilai(Double jumlahProduksi, Double hargaPerKg) {
        if (jumlahProduksi == null || hargaPerKg == null) {
            return 0.0;
        }
        return Math.round(jumlahProduksi * hargaPerKg * 100.0) / 100.0;
    }

    /**
     * Menambahkan data hasil produksi baru
     */
    public ProduksiResponse create(ProduksiRequest request) {
        Double totalNilai = hitungTotalNilai(request.getJumlahProduksi(), request.getHargaPerKg());

        HasilProduksi model = new HasilProduksi();
        model.setJenisIkan(request.getJenisIkan());
        model.setJumlahProduksi(request.getJumlahProduksi());
        model.setSatuan(request.getSatuan());
        model.setHargaPerKg(request.getHargaPerKg());
        model.setTotalNilai(totalNilai); // Dihitung di backend
        model.setTanggalProduksi(request.getTanggalProduksi());
        model.setLokasiProduksi(request.getLokasiProduksi());
        model.setNamaNelayan(request.getNamaNelayan());
        model.setAlatTangkap(request.getAlatTangkap());
        model.setCatatan(request.getCatatan());

        try {
            HasilProduksi saved = repository.save(model);
            return mapToResponse(saved);
        } catch (Exception e) {
            log.error("Gagal menyimpan data produksi ke database: {}", e.getMessage(), e);
            throw new RuntimeException("Gagal menyimpan data produksi: " + e.getMessage(), e);
        }
    }

    /**
     * Mengambil seluruh data produksi
     */
    public List<ProduksiResponse> getAll() {
        try {
            List<HasilProduksi> list = repository.findAll();
            if (list == null || list.isEmpty()) {
                return Collections.emptyList();
            }
            return list.stream().map(this::mapToResponse).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Gagal mengambil data produksi dari database: {}", e.getMessage(), e);
            throw new RuntimeException("Gagal mengambil data produksi: " + e.getMessage(), e);
        }
    }

    /**
     * Mengambil satu data produksi berdasarkan ID
     */
    public ProduksiResponse getById(String id) {
        try {
            HasilProduksi found = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Data produksi dengan ID '" + id + "' tidak ditemukan."));
            return mapToResponse(found);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gagal mengambil data produksi ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Gagal mengambil data produksi: " + e.getMessage(), e);
        }
    }

    /**
     * Memperbarui data produksi yang sudah ada
     */
    public ProduksiResponse update(String id, ProduksiRequest request) {
        try {
            HasilProduksi existing = repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Data produksi dengan ID '" + id + "' tidak ditemukan."));

            Double totalNilai = hitungTotalNilai(request.getJumlahProduksi(), request.getHargaPerKg());

            existing.setJenisIkan(request.getJenisIkan());
            existing.setJumlahProduksi(request.getJumlahProduksi());
            existing.setSatuan(request.getSatuan());
            existing.setHargaPerKg(request.getHargaPerKg());
            existing.setTotalNilai(totalNilai); // Dihitung ulang otomatis
            existing.setTanggalProduksi(request.getTanggalProduksi());
            existing.setLokasiProduksi(request.getLokasiProduksi());
            existing.setNamaNelayan(request.getNamaNelayan());
            if (request.getAlatTangkap() != null) {
                existing.setAlatTangkap(request.getAlatTangkap());
            }
            if (request.getCatatan() != null) {
                existing.setCatatan(request.getCatatan());
            }

            HasilProduksi updated = repository.update(id, existing);
            return mapToResponse(updated);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gagal memperbarui data produksi ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Gagal memperbarui data produksi: " + e.getMessage(), e);
        }
    }

    /**
     * Menghapus data produksi berdasarkan ID
     */
    public void delete(String id) {
        try {
            boolean deleted = repository.deleteById(id);
            if (!deleted) {
                throw new ResourceNotFoundException("Data produksi dengan ID '" + id + "' tidak ditemukan.");
            }
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Gagal menghapus data produksi ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Gagal menghapus data produksi: " + e.getMessage(), e);
        }
    }

    /**
     * Pencarian data produksi berdasarkan keyword
     */
    public List<ProduksiResponse> search(String keyword) {
        try {
            List<HasilProduksi> results = repository.search(keyword);
            return results.stream().map(this::mapToResponse).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Gagal melakukan pencarian data produksi: {}", e.getMessage(), e);
            throw new RuntimeException("Gagal mencari data produksi: " + e.getMessage(), e);
        }
    }

    /**
     * Filter data produksi
     */
    public List<ProduksiResponse> filter(String jenisIkan, String lokasiProduksi, String startDate, String endDate) {
        try {
            List<HasilProduksi> results = repository.filter(jenisIkan, lokasiProduksi, startDate, endDate);
            return results.stream().map(this::mapToResponse).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Gagal memfilter data produksi: {}", e.getMessage(), e);
            throw new RuntimeException("Gagal memfilter data produksi: " + e.getMessage(), e);
        }
    }

    /**
     * Helper mapper dari entity model ke DTO response
     */
    public ProduksiResponse mapToResponse(HasilProduksi model) {
        if (model == null) return null;
        return new ProduksiResponse(
                model.getId(),
                model.getJenisIkan(),
                model.getJumlahProduksi(),
                model.getSatuan(),
                model.getHargaPerKg(),
                model.getTotalNilai(),
                model.getTanggalProduksi(),
                model.getLokasiProduksi(),
                model.getNamaNelayan(),
                model.getAlatTangkap(),
                model.getCatatan(),
                model.getCreatedAt(),
                model.getUpdatedAt()
        );
    }
}
