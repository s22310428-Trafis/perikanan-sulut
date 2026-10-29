package com.perikanan.perikanan_sulut.dto;

/**
 * DTO Response untuk Summary Dashboard Hasil Produksi
 */
public class DashboardSummaryResponse {

    private Double totalProduksi;
    private Double totalNilaiProduksi;
    private Integer jumlahJenisIkan;
    private Integer jumlahLokasiProduksi;
    private Integer totalTransaksi;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(Double totalProduksi, Double totalNilaiProduksi,
                                    Integer jumlahJenisIkan, Integer jumlahLokasiProduksi,
                                    Integer totalTransaksi) {
        this.totalProduksi = totalProduksi;
        this.totalNilaiProduksi = totalNilaiProduksi;
        this.jumlahJenisIkan = jumlahJenisIkan;
        this.jumlahLokasiProduksi = jumlahLokasiProduksi;
        this.totalTransaksi = totalTransaksi;
    }

    public Double getTotalProduksi() {
        return totalProduksi;
    }

    public void setTotalProduksi(Double totalProduksi) {
        this.totalProduksi = totalProduksi;
    }

    public Double getTotalNilaiProduksi() {
        return totalNilaiProduksi;
    }

    public void setTotalNilaiProduksi(Double totalNilaiProduksi) {
        this.totalNilaiProduksi = totalNilaiProduksi;
    }

    public Integer getJumlahJenisIkan() {
        return jumlahJenisIkan;
    }

    public void setJumlahJenisIkan(Integer jumlahJenisIkan) {
        this.jumlahJenisIkan = jumlahJenisIkan;
    }

    public Integer getJumlahLokasiProduksi() {
        return jumlahLokasiProduksi;
    }

    public void setJumlahLokasiProduksi(Integer jumlahLokasiProduksi) {
        this.jumlahLokasiProduksi = jumlahLokasiProduksi;
    }

    public Integer getTotalTransaksi() {
        return totalTransaksi;
    }

    public void setTotalTransaksi(Integer totalTransaksi) {
        this.totalTransaksi = totalTransaksi;
    }
}
