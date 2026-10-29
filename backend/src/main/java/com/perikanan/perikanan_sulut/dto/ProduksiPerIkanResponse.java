package com.perikanan.perikanan_sulut.dto;

/**
 * DTO Response untuk grafik produksi berdasarkan jenis ikan
 */
public class ProduksiPerIkanResponse {

    private String jenisIkan;
    private Double totalProduksi;
    private Double totalNilai;
    private Integer frekuensi;
    private Double persentase;

    public ProduksiPerIkanResponse() {
    }

    public ProduksiPerIkanResponse(String jenisIkan, Double totalProduksi, Double totalNilai,
                                   Integer frekuensi, Double persentase) {
        this.jenisIkan = jenisIkan;
        this.totalProduksi = totalProduksi;
        this.totalNilai = totalNilai;
        this.frekuensi = frekuensi;
        this.persentase = persentase;
    }

    public String getJenisIkan() {
        return jenisIkan;
    }

    public void setJenisIkan(String jenisIkan) {
        this.jenisIkan = jenisIkan;
    }

    public Double getTotalProduksi() {
        return totalProduksi;
    }

    public void setTotalProduksi(Double totalProduksi) {
        this.totalProduksi = totalProduksi;
    }

    public Double getTotalNilai() {
        return totalNilai;
    }

    public void setTotalNilai(Double totalNilai) {
        this.totalNilai = totalNilai;
    }

    public Integer getFrekuensi() {
        return frekuensi;
    }

    public void setFrekuensi(Integer frekuensi) {
        this.frekuensi = frekuensi;
    }

    public Double getPersentase() {
        return persentase;
    }

    public void setPersentase(Double persentase) {
        this.persentase = persentase;
    }
}
