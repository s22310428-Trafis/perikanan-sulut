package com.perikanan.perikanan_sulut.controller;

import com.perikanan.perikanan_sulut.dto.*;
import com.perikanan.perikanan_sulut.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST API Controller untuk Metrik Dashboard & Laporan Analitik
 */
@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "API Ringkasan Statistik, Grafik & Analitik Dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * GET /api/dashboard/summary
     * Mengambil 4 statistik utama: totalProduksi, totalNilaiProduksi, jumlahJenisIkan, jumlahLokasiProduksi
     */
    @GetMapping("/summary")
    @Operation(summary = "Ringkasan statistik dashboard", description = "Mengambil 4 metrik utama: totalProduksi, totalNilaiProduksi, jumlahJenisIkan, dan jumlahLokasiProduksi.")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary() {
        DashboardSummaryResponse summary = dashboardService.getSummary();
        return ResponseEntity.ok(ApiResponse.success("Ringkasan dashboard berhasil dimuat", summary));
    }

    /**
     * GET /api/dashboard/produksi-per-ikan
     * Data visualisasi grafik agregasi produksi berdasarkan jenis ikan
     */
    @GetMapping("/produksi-per-ikan")
    @Operation(summary = "Grafik produksi berdasarkan jenis ikan", description = "Agregasi volume tangkapan (Kg) dan total nilai (Rp) dikelompokkan berdasarkan jenis komoditas ikan.")
    public ResponseEntity<ApiResponse<List<ProduksiPerIkanResponse>>> getProduksiPerIkan() {
        List<ProduksiPerIkanResponse> data = dashboardService.getProduksiPerIkan();
        return ResponseEntity.ok(ApiResponse.success("Data produksi per jenis ikan berhasil diambil", data));
    }

    /**
     * GET /api/dashboard/produksi-periode & GET /api/dashboard/produksi-per-periode
     * Data visualisasi grafik tren produksi berdasarkan waktu
     */
    @GetMapping({"/produksi-periode", "/produksi-per-periode"})
    @Operation(summary = "Grafik produksi berdasarkan waktu/periode", description = "Agregasi volume produksi (Kg) dan nilai transaksi (Rp) berdasarkan deret waktu untuk grafik Recharts.")
    public ResponseEntity<ApiResponse<List<ProduksiPeriodeResponse>>> getProduksiPeriode() {
        List<ProduksiPeriodeResponse> data = dashboardService.getProduksiPeriode();
        return ResponseEntity.ok(ApiResponse.success("Data produksi per periode berhasil diambil", data));
    }

    /**
     * GET /api/dashboard/laporan
     * Data ringkasan analitik komprehensif untuk halaman Laporan Frontend
     */
    @GetMapping("/laporan")
    @Operation(summary = "Ringkasan analitik laporan", description = "Data komprehensif untuk halaman Laporan dan Analitik: metrik utama, produksi per jenis ikan, per lokasi, dan per periode.")
    public ResponseEntity<ApiResponse<LaporanSummaryResponse>> getLaporan() {
        LaporanSummaryResponse data = dashboardService.getLaporanSummary();
        return ResponseEntity.ok(ApiResponse.success("Data laporan analitik berhasil diambil", data));
    }
}
