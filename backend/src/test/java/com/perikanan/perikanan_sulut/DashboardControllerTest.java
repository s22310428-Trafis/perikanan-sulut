package com.perikanan.perikanan_sulut;

import com.perikanan.perikanan_sulut.controller.DashboardController;
import com.perikanan.perikanan_sulut.dto.DashboardSummaryResponse;
import com.perikanan.perikanan_sulut.dto.ProduksiPerIkanResponse;
import com.perikanan.perikanan_sulut.dto.ProduksiPeriodeResponse;
import com.perikanan.perikanan_sulut.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DashboardService dashboardService;

    @InjectMocks
    private DashboardController controller;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("GET /api/dashboard/summary harus mengembalikan total produksi dan total nilai")
    void testGetSummary() throws Exception {
        DashboardSummaryResponse summary = new DashboardSummaryResponse(
                12500.0,
                350000000.0,
                8,
                5,
                42
        );

        when(dashboardService.getSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalProduksi").value(12500.0))
                .andExpect(jsonPath("$.data.totalNilaiProduksi").value(350000000.0))
                .andExpect(jsonPath("$.data.jumlahJenisIkan").value(8))
                .andExpect(jsonPath("$.data.jumlahLokasiProduksi").value(5));
    }

    @Test
    @DisplayName("GET /api/dashboard/produksi-per-ikan harus mengembalikan list jenis ikan")
    void testGetProduksiPerIkan() throws Exception {
        ProduksiPerIkanResponse ikan = new ProduksiPerIkanResponse(
                "Ikan Cakalang",
                5000.0,
                140000000.0,
                12,
                40.0
        );

        when(dashboardService.getProduksiPerIkan()).thenReturn(List.of(ikan));

        mockMvc.perform(get("/api/dashboard/produksi-per-ikan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].jenisIkan").value("Ikan Cakalang"))
                .andExpect(jsonPath("$.data[0].totalProduksi").value(5000.0));
    }

    @Test
    @DisplayName("GET /api/dashboard/produksi-periode harus mengembalikan data tren waktu")
    void testGetProduksiPeriode() throws Exception {
        ProduksiPeriodeResponse periode = new ProduksiPeriodeResponse(
                "2026-10-27",
                1200.0,
                36000000.0,
                4
        );

        when(dashboardService.getProduksiPeriode()).thenReturn(List.of(periode));

        mockMvc.perform(get("/api/dashboard/produksi-periode"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].periode").value("2026-10-27"))
                .andExpect(jsonPath("$.data[0].produksiKg").value(1200.0));
    }
}
