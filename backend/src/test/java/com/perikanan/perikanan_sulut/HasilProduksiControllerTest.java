package com.perikanan.perikanan_sulut;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.perikanan.perikanan_sulut.controller.HasilProduksiController;
import com.perikanan.perikanan_sulut.dto.ProduksiRequest;
import com.perikanan.perikanan_sulut.dto.ProduksiResponse;
import com.perikanan.perikanan_sulut.exception.GlobalExceptionHandler;
import com.perikanan.perikanan_sulut.exception.ResourceNotFoundException;
import com.perikanan.perikanan_sulut.service.HasilProduksiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class HasilProduksiControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HasilProduksiService service;

    @InjectMocks
    private HasilProduksiController controller;

    private ObjectMapper objectMapper;
    private ProduksiResponse sampleResponse;
    private ProduksiRequest sampleRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        objectMapper = new ObjectMapper();

        sampleResponse = new ProduksiResponse(
                "prd-100",
                "Ikan Cakalang",
                150.0,
                "kg",
                30000.0,
                4500000.0,
                "2026-10-27",
                "PPS Bitung",
                "Budi",
                "Purse Seine",
                "Catatan",
                new Date(),
                new Date()
        );

        sampleRequest = new ProduksiRequest();
        sampleRequest.setJenisIkan("Ikan Cakalang");
        sampleRequest.setJumlahProduksi(150.0);
        sampleRequest.setSatuan("kg");
        sampleRequest.setHargaPerKg(30000.0);
        sampleRequest.setTanggalProduksi("2026-10-27");
        sampleRequest.setLokasiProduksi("PPS Bitung");
        sampleRequest.setNamaNelayan("Budi");
    }

    @Test
    @DisplayName("POST /api/produksi berhasil harus mengembalikan HTTP 201 Created dan response JSON")
    void testCreateProduksiSuccess() throws Exception {
        when(service.create(any(ProduksiRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/produksi")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Data produksi berhasil ditambahkan"))
                .andExpect(jsonPath("$.data.id").value("prd-100"))
                .andExpect(jsonPath("$.data.totalNilai").value(4500000.0));
    }

    @Test
    @DisplayName("POST /api/produksi gagal validasi (jumlahProduksi <= 0) harus mengembalikan HTTP 400 Bad Request")
    void testCreateProduksiInvalidQuantity() throws Exception {
        sampleRequest.setJumlahProduksi(-10.0); // Tidak valid (harus > 0)

        mockMvc.perform(post("/api/produksi")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/produksi gagal validasi (jenisIkan kosong) harus mengembalikan HTTP 400 Bad Request")
    void testCreateProduksiBlankFishType() throws Exception {
        sampleRequest.setJenisIkan(""); // Kosong

        mockMvc.perform(post("/api/produksi")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /api/produksi harus mengembalikan list data dan HTTP 200")
    void testGetAllProduksi() throws Exception {
        when(service.getAll()).thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/produksi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value("prd-100"))
                .andExpect(jsonPath("$.data[0].jenisIkan").value("Ikan Cakalang"));
    }

    @Test
    @DisplayName("GET /api/produksi/{id} data ditemukan harus mengembalikan HTTP 200")
    void testGetProduksiByIdFound() throws Exception {
        when(service.getById("prd-100")).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/produksi/prd-100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("prd-100"));
    }

    @Test
    @DisplayName("GET /api/produksi/{id} data tidak ditemukan harus mengembalikan HTTP 404 Not Found")
    void testGetProduksiByIdNotFound() throws Exception {
        when(service.getById("non-existent"))
                .thenThrow(new ResourceNotFoundException("Data produksi dengan ID 'non-existent' tidak ditemukan."));

        mockMvc.perform(get("/api/produksi/non-existent"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Data produksi dengan ID 'non-existent' tidak ditemukan."));
    }

    @Test
    @DisplayName("PUT /api/produksi/{id} berhasil harus mengembalikan HTTP 200")
    void testUpdateProduksi() throws Exception {
        when(service.update(eq("prd-100"), any(ProduksiRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(put("/api/produksi/prd-100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Data produksi berhasil diperbarui"));
    }

    @Test
    @DisplayName("DELETE /api/produksi/{id} berhasil harus mengembalikan HTTP 200")
    void testDeleteProduksi() throws Exception {
        doNothing().when(service).delete("prd-100");

        mockMvc.perform(delete("/api/produksi/prd-100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Data produksi berhasil dihapus"));
    }

    @Test
    @DisplayName("DELETE /api/produksi/{id} tidak ditemukan harus mengembalikan HTTP 404")
    void testDeleteProduksiNotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Data produksi dengan ID 'unknown' tidak ditemukan."))
                .when(service).delete("unknown");

        mockMvc.perform(delete("/api/produksi/unknown"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
