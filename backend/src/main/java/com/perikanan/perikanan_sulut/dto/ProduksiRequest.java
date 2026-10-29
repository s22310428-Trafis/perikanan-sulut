package com.perikanan.perikanan_sulut.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * DTO Request untuk Tambah dan Ubah Data Produksi
 */
public class ProduksiRequest {

    @NotBlank(message = "Jenis ikan wajib diisi")
    private String jenisIkan;

    @NotNull(message = "Jumlah produksi wajib diisi")
    @Positive(message = "Jumlah produksi harus lebih besar dari 0")
    private Double jumlahProduksi;

    @NotBlank(message = "Satuan wajib diisi (contoh: kg atau ton)")
    private String satuan;

    @NotNull(message = "Harga per kg wajib diisi")
    @PositiveOrZero(message = "Harga per kg harus lebih besar atau sama dengan 0")
    private Double hargaPerKg;

    @NotBlank(message = "Tanggal produksi wajib diisi")
    private String tanggalProduksi;

    @NotBlank(message = "Lokasi produksi / pendaratan wajib diisi")
    private String lokasiProduksi;

    @NotBlank(message = "Nama nelayan atau kapal penangkap wajib diisi")
    private String namaNelayan;

    private String alatTangkap;
    private String catatan;

    public ProduksiRequest() {
    }

    public String getJenisIkan() {
        return jenisIkan;
    }

    public void setJenisIkan(String jenisIkan) {
        this.jenisIkan = jenisIkan;
    }

    public Double getJumlahProduksi() {
        return jumlahProduksi;
    }

    public void setJumlahProduksi(Double jumlahProduksi) {
        this.jumlahProduksi = jumlahProduksi;
    }

    public String getSatuan() {
        return satuan;
    }

    public void setSatuan(String satuan) {
        this.satuan = satuan;
    }

    public Double getHargaPerKg() {
        return hargaPerKg;
    }

    public void setHargaPerKg(Double hargaPerKg) {
        this.hargaPerKg = hargaPerKg;
    }

    public String getTanggalProduksi() {
        return tanggalProduksi;
    }

    public void setTanggalProduksi(String tanggalProduksi) {
        this.tanggalProduksi = tanggalProduksi;
    }

    public String getLokasiProduksi() {
        return lokasiProduksi;
    }

    public void setLokasiProduksi(String lokasiProduksi) {
        this.lokasiProduksi = lokasiProduksi;
    }

    public String getNamaNelayan() {
        return namaNelayan;
    }

    public void setNamaNelayan(String namaNelayan) {
        this.namaNelayan = namaNelayan;
    }

    public String getAlatTangkap() {
        return alatTangkap;
    }

    public void setAlatTangkap(String alatTangkap) {
        this.alatTangkap = alatTangkap;
    }

    public String getCatatan() {
        return catatan;
    }

    public void setCatatan(String catatan) {
        this.catatan = catatan;
    }
}
