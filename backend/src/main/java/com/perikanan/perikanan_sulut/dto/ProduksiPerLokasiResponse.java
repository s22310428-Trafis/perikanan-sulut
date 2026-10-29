package com.perikanan.perikanan_sulut.dto;

/**
 * DTO Response untuk ringkasan produksi per lokasi pelabuhan / TPI
 */
public class ProduksiPerLokasiResponse {

    private String lokasiProduksi;
    private Double totalProduksi;
    private Double totalNilai;
    private Integer frekuensi;
    private Double persentase;

    public ProduksiPerLokasiResponse() {
    }

    public ProduksiPerLokasiResponse(String lokasiProduksi, Double totalProduksi, Double totalNilai,
                                     Integer frekuensi, Double persentase) {
        this.lokasiProduksi = lokasiProduksi;
        this.totalProduksi = totalProduksi;
        this.totalNilai = totalNilai;
        this.frekuensi = frekuensi;
        this.persentase = persentase;
    }

    public String getLokasiProduksi() {
        return lokasiProduksi;
    }

    public void setLokasiProduksi(String lokasiProduksi) {
        this.lokasiProduksi = lokasiProduksi;
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
