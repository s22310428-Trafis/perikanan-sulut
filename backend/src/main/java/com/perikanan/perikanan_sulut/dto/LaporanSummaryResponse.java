package com.perikanan.perikanan_sulut.dto;

import java.util.List;

/**
 * DTO Response untuk Halaman Laporan dan Analisis Komprehensif
 */
public class LaporanSummaryResponse {

    private Double totalProduksi;
    private Double totalNilaiProduksi;
    private Double rataRataHargaPerKg;
    private String komoditasUtama;
    private List<ProduksiPerIkanResponse> produksiPerIkan;
    private List<ProduksiPerLokasiResponse> produksiPerLokasi;
    private List<ProduksiPeriodeResponse> produksiPerPeriode;

    public LaporanSummaryResponse() {
    }

    public LaporanSummaryResponse(Double totalProduksi, Double totalNilaiProduksi,
                                  Double rataRataHargaPerKg, String komoditasUtama,
                                  List<ProduksiPerIkanResponse> produksiPerIkan,
                                  List<ProduksiPerLokasiResponse> produksiPerLokasi,
                                  List<ProduksiPeriodeResponse> produksiPerPeriode) {
        this.totalProduksi = totalProduksi;
        this.totalNilaiProduksi = totalNilaiProduksi;
        this.rataRataHargaPerKg = rataRataHargaPerKg;
        this.komoditasUtama = komoditasUtama;
        this.produksiPerIkan = produksiPerIkan;
        this.produksiPerLokasi = produksiPerLokasi;
        this.produksiPerPeriode = produksiPerPeriode;
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

    public Double getRataRataHargaPerKg() {
        return rataRataHargaPerKg;
    }

    public void setRataRataHargaPerKg(Double rataRataHargaPerKg) {
        this.rataRataHargaPerKg = rataRataHargaPerKg;
    }

    public String getKomoditasUtama() {
        return komoditasUtama;
    }

    public void setKomoditasUtama(String komoditasUtama) {
        this.komoditasUtama = komoditasUtama;
    }

    public List<ProduksiPerIkanResponse> getProduksiPerIkan() {
        return produksiPerIkan;
    }

    public void setProduksiPerIkan(List<ProduksiPerIkanResponse> produksiPerIkan) {
        this.produksiPerIkan = produksiPerIkan;
    }

    public List<ProduksiPerLokasiResponse> getProduksiPerLokasi() {
        return produksiPerLokasi;
    }

    public void setProduksiPerLokasi(List<ProduksiPerLokasiResponse> produksiPerLokasi) {
        this.produksiPerLokasi = produksiPerLokasi;
    }

    public List<ProduksiPeriodeResponse> getProduksiPerPeriode() {
        return produksiPerPeriode;
    }

    public void setProduksiPerPeriode(List<ProduksiPeriodeResponse> produksiPerPeriode) {
        this.produksiPerPeriode = produksiPerPeriode;
    }
}
