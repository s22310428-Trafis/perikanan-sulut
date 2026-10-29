package com.perikanan.perikanan_sulut.controller;

import com.perikanan.perikanan_sulut.dto.ApiResponse;
import com.perikanan.perikanan_sulut.dto.LaporanSummaryResponse;
import com.perikanan.perikanan_sulut.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API Controller untuk Halaman Laporan & Analitik Perikanan Sulawesi Utara
 */
@RestController
@RequestMapping("/api/laporan")
public class LaporanController {

    private final DashboardService dashboardService;

    public LaporanController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * GET /api/laporan & GET /api/laporan/summary
     * Mengambil ringkasan analitik komprehensif untuk visualisasi Recharts
     */
    @GetMapping({"", "/summary"})
    public ResponseEntity<ApiResponse<LaporanSummaryResponse>> getLaporanSummary() {
        LaporanSummaryResponse laporan = dashboardService.getLaporanSummary();
        return ResponseEntity.ok(ApiResponse.success("Laporan analitik produksi berhasil dimuat", laporan));
    }
}
