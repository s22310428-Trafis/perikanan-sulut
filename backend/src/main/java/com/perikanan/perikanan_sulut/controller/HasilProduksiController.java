package com.perikanan.perikanan_sulut.controller;

import com.perikanan.perikanan_sulut.dto.ApiResponse;
import com.perikanan.perikanan_sulut.dto.ProduksiRequest;
import com.perikanan.perikanan_sulut.dto.ProduksiResponse;
import com.perikanan.perikanan_sulut.service.HasilProduksiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API Controller untuk Data Hasil Produksi Perikanan Sulawesi Utara
 * Menyediakan endpoint CRUD, Search, dan Filter.
 */
@RestController
@RequestMapping({"/api/produksi", "/api/production"})
@Tag(name = "Produksi", description = "API Pengelolaan Data Hasil Produksi Perikanan Sulawesi Utara")
public class HasilProduksiController {

    private final HasilProduksiService service;

    public HasilProduksiController(HasilProduksiService service) {
        this.service = service;
    }

    /**
     * POST /api/produksi
     * Menambahkan data produksi baru.
     * Total nilai dihitung otomatis oleh backend.
     */
    @PostMapping
    @Operation(summary = "Tambah data produksi baru", description = "Menambahkan catatan hasil produksi ikan ke Cloud Firestore. Total nilai (jumlah × harga) otomatis dihitung oleh backend.")
    public ResponseEntity<ApiResponse<ProduksiResponse>> createProduksi(@Valid @RequestBody ProduksiRequest request) {
        ProduksiResponse created = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Data produksi berhasil ditambahkan", created));
    }

    /**
     * GET /api/produksi
     * Mengambil daftar data produksi, mendukung query filter: jenisIkan, lokasiProduksi, startDate, endDate.
     */
    @GetMapping
    @Operation(summary = "Ambil semua data produksi / filter", description = "Mengambil seluruh daftar data hasil produksi perikanan dari Firestore, mendukung parameter filter jenisIkan, lokasiProduksi, startDate, dan endDate.")
    public ResponseEntity<ApiResponse<List<ProduksiResponse>>> getAllProduksi(
            @Parameter(description = "Filter berdasarkan jenis ikan, contoh: Cakalang")
            @RequestParam(required = false) String jenisIkan,
            @Parameter(description = "Filter berdasarkan lokasi produksi / TPI, contoh: Bitung")
            @RequestParam(required = false) String lokasiProduksi,
            @Parameter(description = "Filter tanggal awal pendaratan (YYYY-MM-DD)")
            @RequestParam(required = false) String startDate,
            @Parameter(description = "Filter tanggal akhir pendaratan (YYYY-MM-DD)")
            @RequestParam(required = false) String endDate) {

        List<ProduksiResponse> data;
        boolean hasFilter = (jenisIkan != null && !jenisIkan.isBlank()) ||
                            (lokasiProduksi != null && !lokasiProduksi.isBlank()) ||
                            (startDate != null && !startDate.isBlank()) ||
                            (endDate != null && !endDate.isBlank());

        if (hasFilter) {
            data = service.filter(jenisIkan, lokasiProduksi, startDate, endDate);
        } else {
            data = service.getAll();
        }

        String message = data.isEmpty() ? "Belum ada data produksi" : "Data produksi berhasil diambil";
        return ResponseEntity.ok(ApiResponse.success(message, data));
    }

    /**
     * GET /api/produksi/{id}
     * Mengambil detail satu data produksi berdasarkan ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Ambil detail data produksi", description = "Mengambil satu record data hasil produksi berdasarkan document ID Firestore.")
    public ResponseEntity<ApiResponse<ProduksiResponse>> getProduksiById(
            @Parameter(description = "ID Dokumen Produksi") @PathVariable String id) {
        ProduksiResponse data = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Data produksi berhasil ditemukan", data));
    }

    /**
     * PUT /api/produksi/{id}
     * Memperbarui data produksi yang sudah ada.
     * Total nilai dihitung ulang otomatis oleh backend.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Perbarui data produksi", description = "Memperbarui data hasil produksi perikanan. Total nilai akan dihitung ulang secara otomatis oleh backend.")
    public ResponseEntity<ApiResponse<ProduksiResponse>> updateProduksi(
            @Parameter(description = "ID Dokumen Produksi yang akan diperbarui") @PathVariable String id,
            @Valid @RequestBody ProduksiRequest request) {
        ProduksiResponse updated = service.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Data produksi berhasil diperbarui", updated));
    }

    /**
     * DELETE /api/produksi/{id}
     * Menghapus data produksi berdasarkan ID.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Hapus data produksi", description = "Menghapus data hasil produksi dari Cloud Firestore berdasarkan ID.")
    public ResponseEntity<ApiResponse<Void>> deleteProduksi(
            @Parameter(description = "ID Dokumen Produksi yang akan dihapus") @PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Data produksi berhasil dihapus", null));
    }

    /**
     * GET /api/produksi/search?keyword=...
     * Pencarian fleksibel pada jenisIkan, namaNelayan, atau lokasiProduksi.
     */
    @GetMapping("/search")
    @Operation(summary = "Pencarian data produksi", description = "Mencari data produksi berdasarkan keyword pada jenisIkan, namaNelayan, atau lokasiProduksi.")
    public ResponseEntity<ApiResponse<List<ProduksiResponse>>> searchProduksi(
            @Parameter(description = "Kata kunci pencarian")
            @RequestParam(required = false, defaultValue = "") String keyword) {
        List<ProduksiResponse> results = service.search(keyword);
        String message = results.isEmpty() ? "Tidak ditemukan data produksi yang cocok" : "Pencarian data produksi berhasil";
        return ResponseEntity.ok(ApiResponse.success(message, results));
    }
}
