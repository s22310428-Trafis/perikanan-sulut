package com.perikanan.perikanan_sulut.dto;

import java.util.Date;

/**
 * DTO Response data hasil produksi perikanan
 */
public class ProduksiResponse {

    private String id;
    private String jenisIkan;
    private Double jumlahProduksi;
    private String satuan;
    private Double hargaPerKg;
    private Double totalNilai;
    private String tanggalProduksi;
    private String lokasiProduksi;
    private String namaNelayan;
    private String alatTangkap;
    private String catatan;
    private Date createdAt;
    private Date updatedAt;

    public ProduksiResponse() {
    }

    public ProduksiResponse(String id, String jenisIkan, Double jumlahProduksi, String satuan,
                            Double hargaPerKg, Double totalNilai, String tanggalProduksi,
                            String lokasiProduksi, String namaNelayan, String alatTangkap,
                            String catatan, Date createdAt, Date updatedAt) {
        this.id = id;
        this.jenisIkan = jenisIkan;
        this.jumlahProduksi = jumlahProduksi;
        this.satuan = satuan;
        this.hargaPerKg = hargaPerKg;
        this.totalNilai = totalNilai;
        this.tanggalProduksi = tanggalProduksi;
        this.lokasiProduksi = lokasiProduksi;
        this.namaNelayan = namaNelayan;
        this.alatTangkap = alatTangkap;
        this.catatan = catatan;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Double getTotalNilai() {
        return totalNilai;
    }

    public void setTotalNilai(Double totalNilai) {
        this.totalNilai = totalNilai;
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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
