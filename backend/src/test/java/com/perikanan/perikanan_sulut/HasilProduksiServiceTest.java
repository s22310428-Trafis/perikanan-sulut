package com.perikanan.perikanan_sulut;

import com.perikanan.perikanan_sulut.dto.ProduksiRequest;
import com.perikanan.perikanan_sulut.dto.ProduksiResponse;
import com.perikanan.perikanan_sulut.exception.ResourceNotFoundException;
import com.perikanan.perikanan_sulut.model.HasilProduksi;
import com.perikanan.perikanan_sulut.repository.HasilProduksiRepository;
import com.perikanan.perikanan_sulut.service.HasilProduksiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HasilProduksiServiceTest {

    @Mock
    private HasilProduksiRepository repository;

    @InjectMocks
    private HasilProduksiService service;

    private HasilProduksi sampleProduksi;
    private ProduksiRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleProduksi = new HasilProduksi(
                "prd-001",
                "Ikan Cakalang",
                150.0,
                "kg",
                30000.0,
                4500000.0,
                "2026-10-27",
                "PPS Bitung",
                "Budi",
                "Purse Seine",
                "Segar",
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
        sampleRequest.setAlatTangkap("Purse Seine");
        sampleRequest.setCatatan("Segar");
    }

    @Test
    @DisplayName("Kalkulasi Total Nilai harus akurat: jumlah × harga")
    void testHitungTotalNilai() {
        Double total = service.hitungTotalNilai(150.0, 30000.0);
        assertEquals(4500000.0, total);

        // Uji jika null
        assertEquals(0.0, service.hitungTotalNilai(null, 30000.0));
        assertEquals(0.0, service.hitungTotalNilai(150.0, null));
    }

    @Test
    @DisplayName("Create produksi baru harus berhasil dan menghitung totalNilai di backend")
    void testCreateProduksi() throws Exception {
        when(repository.save(any(HasilProduksi.class))).thenReturn(sampleProduksi);

        ProduksiResponse response = service.create(sampleRequest);

        assertNotNull(response);
        assertEquals("prd-001", response.getId());
        assertEquals("Ikan Cakalang", response.getJenisIkan());
        assertEquals(4500000.0, response.getTotalNilai());
        verify(repository, times(1)).save(any(HasilProduksi.class));
    }

    @Test
    @DisplayName("GetAll harus mengembalikan seluruh data produksi")
    void testGetAllProduksi() throws Exception {
        when(repository.findAll()).thenReturn(List.of(sampleProduksi));

        List<ProduksiResponse> results = service.getAll();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Ikan Cakalang", results.get(0).getJenisIkan());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("GetById ketika data ditemukan")
    void testGetByIdFound() throws Exception {
        when(repository.findById("prd-001")).thenReturn(Optional.of(sampleProduksi));

        ProduksiResponse response = service.getById("prd-001");

        assertNotNull(response);
        assertEquals("prd-001", response.getId());
        assertEquals("Ikan Cakalang", response.getJenisIkan());
    }

    @Test
    @DisplayName("GetById ketika data tidak ditemukan harus melempar ResourceNotFoundException")
    void testGetByIdNotFound() throws Exception {
        when(repository.findById("non-existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getById("non-existent"));
    }

    @Test
    @DisplayName("Update produksi harus menghitung ulang total nilai dan memperbarui data")
    void testUpdateProduksi() throws Exception {
        when(repository.findById("prd-001")).thenReturn(Optional.of(sampleProduksi));

        // Ubah jumlah produksi menjadi 200 Kg
        sampleRequest.setJumlahProduksi(200.0);
        sampleProduksi.setJumlahProduksi(200.0);
        sampleProduksi.setTotalNilai(6000000.0);

        when(repository.update(eq("prd-001"), any(HasilProduksi.class))).thenReturn(sampleProduksi);

        ProduksiResponse response = service.update("prd-001", sampleRequest);

        assertNotNull(response);
        assertEquals(200.0, response.getJumlahProduksi());
        assertEquals(6000000.0, response.getTotalNilai());
        verify(repository, times(1)).update(eq("prd-001"), any(HasilProduksi.class));
    }

    @Test
    @DisplayName("Delete produksi ketika data ada harus berhasil")
    void testDeleteProduksiSuccess() throws Exception {
        when(repository.deleteById("prd-001")).thenReturn(true);

        assertDoesNotThrow(() -> service.delete("prd-001"));
        verify(repository, times(1)).deleteById("prd-001");
    }

    @Test
    @DisplayName("Delete produksi ketika ID tidak ditemukan harus melempar ResourceNotFoundException")
    void testDeleteProduksiNotFound() throws Exception {
        when(repository.deleteById("unknown-id")).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> service.delete("unknown-id"));
    }

    @Test
    @DisplayName("Search produksi berdasarkan keyword jenisIkan atau nelayan")
    void testSearchProduksi() throws Exception {
        when(repository.search("cakalang")).thenReturn(List.of(sampleProduksi));

        List<ProduksiResponse> results = service.search("cakalang");

        assertEquals(1, results.size());
        assertEquals("Ikan Cakalang", results.get(0).getJenisIkan());
    }
}
