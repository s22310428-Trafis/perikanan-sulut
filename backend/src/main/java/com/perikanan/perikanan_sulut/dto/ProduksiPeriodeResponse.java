package com.perikanan.perikanan_sulut.dto;

/**
 * DTO Response untuk grafik produksi berdasarkan periode waktu (bulan / tanggal)
 */
public class ProduksiPeriodeResponse {

    private String periode;
    private Double produksiKg;
    private Double nilaiRupiah;
    private Integer kapalAktif;

    public ProduksiPeriodeResponse() {
    }

    public ProduksiPeriodeResponse(String periode, Double produksiKg, Double nilaiRupiah, Integer kapalAktif) {
        this.periode = periode;
        this.produksiKg = produksiKg;
        this.nilaiRupiah = nilaiRupiah;
        this.kapalAktif = kapalAktif;
    }

    public String getPeriode() {
        return periode;
    }

    public void setPeriode(String periode) {
        this.periode = periode;
    }

    public Double getProduksiKg() {
        return produksiKg;
    }

    public void setProduksiKg(Double produksiKg) {
        this.produksiKg = produksiKg;
    }

    public Double getNilaiRupiah() {
        return nilaiRupiah;
    }

    public void setNilaiRupiah(Double nilaiRupiah) {
        this.nilaiRupiah = nilaiRupiah;
    }

    public Integer getKapalAktif() {
        return kapalAktif;
    }

    public void setKapalAktif(Integer kapalAktif) {
        this.kapalAktif = kapalAktif;
    }
}
