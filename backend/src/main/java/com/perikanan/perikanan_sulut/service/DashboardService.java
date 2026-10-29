package com.perikanan.perikanan_sulut.service;

import com.perikanan.perikanan_sulut.dto.*;
import com.perikanan.perikanan_sulut.model.HasilProduksi;
import com.perikanan.perikanan_sulut.repository.HasilProduksiRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service Layer untuk Agregasi Metrik Dashboard & Halaman Laporan
 */
@Service
public class DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);

    private final HasilProduksiRepository repository;

    public DashboardService(HasilProduksiRepository repository) {
        this.repository = repository;
    }

    /**
     * Menghitung Ringkasan Eksekutif Metrik Dashboard
     */
    public DashboardSummaryResponse getSummary() {
        try {
            List<HasilProduksi> list = repository.findAll();

            double totalProduksi = 0.0;
            double totalNilai = 0.0;
            Set<String> jenisIkanSet = new HashSet<>();
            Set<String> lokasiSet = new HashSet<>();

            for (HasilProduksi p : list) {
                if (p.getJumlahProduksi() != null) {
                    totalProduksi += p.getJumlahProduksi();
                }
                if (p.getTotalNilai() != null) {
                    totalNilai += p.getTotalNilai();
                }
                if (p.getJenisIkan() != null && !p.getJenisIkan().isBlank()) {
                    jenisIkanSet.add(p.getJenisIkan().trim());
                }
                if (p.getLokasiProduksi() != null && !p.getLokasiProduksi().isBlank()) {
                    lokasiSet.add(p.getLokasiProduksi().trim());
                }
            }

            return new DashboardSummaryResponse(
                    Math.round(totalProduksi * 100.0) / 100.0,
                    Math.round(totalNilai * 100.0) / 100.0,
                    jenisIkanSet.size(),
                    lokasiSet.size(),
                    list.size()
            );
        } catch (Exception e) {
            log.error("Gagal menghitung ringkasan dashboard: {}", e.getMessage(), e);
            throw new RuntimeException("Gagal menghitung ringkasan dashboard: " + e.getMessage(), e);
        }
    }

    /**
     * Agregasi data hasil produksi berdasarkan jenis ikan untuk visualisasi grafik
     */
    public List<ProduksiPerIkanResponse> getProduksiPerIkan() {
        try {
            List<HasilProduksi> list = repository.findAll();
            if (list.isEmpty()) {
                return Collections.emptyList();
            }

            double grandTotalProduksi = list.stream()
                    .mapToDouble(p -> p.getJumlahProduksi() != null ? p.getJumlahProduksi() : 0.0)
                    .sum();

            Map<String, List<HasilProduksi>> grouped = list.stream()
                    .filter(p -> p.getJenisIkan() != null && !p.getJenisIkan().isBlank())
                    .collect(Collectors.groupingBy(HasilProduksi::getJenisIkan));

            List<ProduksiPerIkanResponse> results = new ArrayList<>();
            for (Map.Entry<String, List<HasilProduksi>> entry : grouped.entrySet()) {
                String ikan = entry.getKey();
                List<HasilProduksi> items = entry.getValue();

                double totalKg = items.stream()
                        .mapToDouble(p -> p.getJumlahProduksi() != null ? p.getJumlahProduksi() : 0.0)
                        .sum();
                double totalRp = items.stream()
                        .mapToDouble(p -> p.getTotalNilai() != null ? p.getTotalNilai() : 0.0)
                        .sum();
                int frekuensi = items.size();
                double persentase = grandTotalProduksi > 0 ? (totalKg / grandTotalProduksi) * 100.0 : 0.0;

                results.add(new ProduksiPerIkanResponse(
                        ikan,
                        Math.round(totalKg * 10.0) / 10.0,
                        (double) Math.round(totalRp),
                        frekuensi,
                        Math.round(persentase * 10.0) / 10.0
                ));
            }

            // Urutkan dari volume produksi tertinggi
            results.sort((a, b) -> Double.compare(b.getTotalProduksi(), a.getTotalProduksi()));
            return results;
        } catch (Exception e) {
            log.error("Gagal mengambil data produksi per ikan: {}", e.getMessage(), e);
            throw new RuntimeException("Gagal mengambil agregasi per jenis ikan: " + e.getMessage(), e);
        }
    }

    /**
     * Agregasi data hasil produksi per periode (berdasarkan tanggal/bulan) untuk grafik Recharts
     */
    public List<ProduksiPeriodeResponse> getProduksiPeriode() {
        try {
            List<HasilProduksi> list = repository.findAll();
            if (list.isEmpty()) {
                return Collections.emptyList();
            }

            // Kelompokkan per tanggal (atau format YYYY-MM)
            Map<String, List<HasilProduksi>> grouped = new TreeMap<>();
            for (HasilProduksi p : list) {
                String date = p.getTanggalProduksi();
                if (date == null || date.isBlank()) {
                    date = "Lainnya";
                }
                grouped.computeIfAbsent(date, k -> new ArrayList<>()).add(p);
            }

            List<ProduksiPeriodeResponse> results = new ArrayList<>();
            for (Map.Entry<String, List<HasilProduksi>> entry : grouped.entrySet()) {
                String periode = entry.getKey();
                List<HasilProduksi> items = entry.getValue();

                double sumKg = items.stream()
                        .mapToDouble(p -> p.getJumlahProduksi() != null ? p.getJumlahProduksi() : 0.0)
                        .sum();
                double sumRp = items.stream()
                        .mapToDouble(p -> p.getTotalNilai() != null ? p.getTotalNilai() : 0.0)
                        .sum();

                Set<String> kapalSet = items.stream()
                        .map(HasilProduksi::getNamaNelayan)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());

                results.add(new ProduksiPeriodeResponse(
                        periode,
                        Math.round(sumKg * 10.0) / 10.0,
                        (double) Math.round(sumRp),
                        kapalSet.size()
                ));
            }

            return results;
        } catch (Exception e) {
            log.error("Gagal mengambil data produksi per periode: {}", e.getMessage(), e);
            throw new RuntimeException("Gagal mengambil agregasi per periode: " + e.getMessage(), e);
        }
    }

    /**
     * Agregasi data hasil produksi per lokasi pelabuhan / TPI
     */
    public List<ProduksiPerLokasiResponse> getProduksiPerLokasi() {
        try {
            List<HasilProduksi> list = repository.findAll();
            if (list.isEmpty()) {
                return Collections.emptyList();
            }

            double grandTotalProduksi = list.stream()
                    .mapToDouble(p -> p.getJumlahProduksi() != null ? p.getJumlahProduksi() : 0.0)
                    .sum();

            Map<String, List<HasilProduksi>> grouped = list.stream()
                    .filter(p -> p.getLokasiProduksi() != null && !p.getLokasiProduksi().isBlank())
                    .collect(Collectors.groupingBy(HasilProduksi::getLokasiProduksi));

            List<ProduksiPerLokasiResponse> results = new ArrayList<>();
            for (Map.Entry<String, List<HasilProduksi>> entry : grouped.entrySet()) {
                String lokasi = entry.getKey();
                List<HasilProduksi> items = entry.getValue();

                double totalKg = items.stream()
                        .mapToDouble(p -> p.getJumlahProduksi() != null ? p.getJumlahProduksi() : 0.0)
                        .sum();
                double totalRp = items.stream()
                        .mapToDouble(p -> p.getTotalNilai() != null ? p.getTotalNilai() : 0.0)
                        .sum();
                int frekuensi = items.size();
                double persentase = grandTotalProduksi > 0 ? (totalKg / grandTotalProduksi) * 100.0 : 0.0;

                results.add(new ProduksiPerLokasiResponse(
                        lokasi,
                        Math.round(totalKg * 10.0) / 10.0,
                        (double) Math.round(totalRp),
                        frekuensi,
                        Math.round(persentase * 10.0) / 10.0
                ));
            }

            results.sort((a, b) -> Double.compare(b.getTotalProduksi(), a.getTotalProduksi()));
            return results;
        } catch (Exception e) {
            log.error("Gagal mengambil data produksi per lokasi: {}", e.getMessage(), e);
            throw new RuntimeException("Gagal mengambil agregasi per lokasi: " + e.getMessage(), e);
        }
    }

    /**
     * Ringkasan lengkap untuk kebutuhan halaman Laporan & Analitik Frontend
     */
    public LaporanSummaryResponse getLaporanSummary() {
        DashboardSummaryResponse summary = getSummary();
        List<ProduksiPerIkanResponse> perIkan = getProduksiPerIkan();
        List<ProduksiPerLokasiResponse> perLokasi = getProduksiPerLokasi();
        List<ProduksiPeriodeResponse> perPeriode = getProduksiPeriode();

        double avgPrice = 0.0;
        if (summary.getTotalProduksi() != null && summary.getTotalProduksi() > 0) {
            avgPrice = Math.round(summary.getTotalNilaiProduksi() / summary.getTotalProduksi());
        }

        String komoditasUtama = perIkan.isEmpty() ? "-" : perIkan.get(0).getJenisIkan();

        return new LaporanSummaryResponse(
                summary.getTotalProduksi(),
                summary.getTotalNilaiProduksi(),
                avgPrice,
                komoditasUtama,
                perIkan,
                perLokasi,
                perPeriode
        );
    }
}
