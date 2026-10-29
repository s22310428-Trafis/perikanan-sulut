import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Fish,
  Shield,
  UserCheck,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' or 'user'
  const [email, setEmail] = useState('admin.dkp@sulutprov.go.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Switch role tab
  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin.dkp@sulutprov.go.id');
      setPassword('admin123');
    } else {
      setEmail('nelayan.sulut@gmail.com');
      setPassword('user123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(selectedRole);
      addToast(
        selectedRole === 'admin'
          ? 'Selamat Datang, Administrator DKP Sulawesi Utara! Akses CRUD penuh aktif.'
          : 'Selamat Datang di Portal Publik SIPROKAN Sulawesi Utara (Mode Read-Only).',
        'success'
      );

      const from = location.state?.from?.pathname;
      const destination =
        from && from !== '/login'
          ? from
          : selectedRole === 'admin'
          ? '/admin/dashboard'
          : '/user/dashboard';

      navigate(destination, { replace: true });
      setIsLoading(false);
    }, 350);
  };

  const handleQuickLogin = (role) => {
    setIsLoading(true);
    setTimeout(() => {
      login(role);
      addToast(
        role === 'admin'
          ? 'Masuk otomatis sebagai Administrator DKP Sulut (Akses Penuh CRUD).'
          : 'Masuk otomatis sebagai Pengguna Publik / Nelayan (Hanya Baca).',
        'success'
      );
      navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
      setIsLoading(false);
    }, 250);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative select-none bg-slate-950 font-sans"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(4, 30, 20, 0.55), rgba(2, 44, 34, 0.72), rgba(15, 23, 42, 0.88)), url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Soft Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center my-auto">
        {/* Top App Emblem Badge */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-3 border border-white/40 transform hover:scale-105 transition-transform shrink-0">
          <Fish className="w-9 h-9 sm:w-10 sm:h-10 stroke-[2.2]" />
        </div>

        {/* Heading: Masuk ke SIPROKAN */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md text-center">
          Masuk ke <span className="text-emerald-400 drop-shadow-sm">SIPROKAN</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium text-center mt-2 drop-shadow-sm max-w-md mb-6 leading-relaxed">
          Sistem Informasi Hasil Produksi Perikanan Provinsi Sulawesi Utara
        </p>

        {/* Main Floating Glassmorphic Login Card */}
        <div className="w-full bg-slate-950/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
          {/* Section: Pilih Peran Akses */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 text-left">
              Pilih Peran Akses Masuk:
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Card Role 1: Admin */}
              <button
                type="button"
                onClick={() => handleRoleTabChange('admin')}
                className={`p-3.5 rounded-2xl flex flex-col items-start gap-1.5 transition-all text-left cursor-pointer border ${
                  selectedRole === 'admin'
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Shield
                      className={`w-4 h-4 ${
                        selectedRole === 'admin' ? 'text-emerald-300' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-extrabold">Admin DKP</span>
                  </div>
                  {selectedRole === 'admin' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 font-normal leading-tight">
                  Pengelolaan Penuh (CRUD)
                </p>
              </button>

              {/* Card Role 2: User Publik */}
              <button
                type="button"
                onClick={() => handleRoleTabChange('user')}
                className={`p-3.5 rounded-2xl flex flex-col items-start gap-1.5 transition-all text-left cursor-pointer border ${
                  selectedRole === 'user'
                    ? 'bg-teal-500/20 border-teal-400 text-white shadow-lg shadow-teal-500/20 ring-1 ring-teal-400'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <UserCheck
                      className={`w-4 h-4 ${
                        selectedRole === 'user' ? 'text-teal-300' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-extrabold">Pengguna Publik</span>
                  </div>
                  {selectedRole === 'user' && (
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 font-normal leading-tight">
                  Transparansi (Hanya Baca)
                </p>
              </button>
            </div>
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input ALAMAT EMAIL */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                ALAMAT EMAIL
              </label>
              <div className="relative flex items-center rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all">
                <Mail className="w-5 h-5 text-emerald-300 ml-3.5 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perikanansulut.id"
                  required
                  className="w-full py-3 pl-3 pr-4 bg-transparent text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Input KATA SANDI */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200">
                KATA SANDI
              </label>
              <div className="relative flex items-center rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all">
                <Lock className="w-5 h-5 text-emerald-300 ml-3.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full py-3 pl-3 pr-11 bg-transparent text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
                  aria-label="Lihat kata sandi"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Submit Button: Masuk Akun ➔ */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 active:from-emerald-500 active:to-cyan-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer mt-1"
            >
              <span>
                {isLoading
                  ? 'Memverifikasi...'
                  : selectedRole === 'admin'
                  ? 'Masuk ke Portal Admin'
                  : 'Masuk ke Portal Publik'}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Clean Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-white/15 w-full" />
            <span className="bg-slate-950 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute rounded-full border border-white/15">
              atau preview cepat
            </span>
          </div>

          {/* Quick 1-Click Access Buttons */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-emerald-400/50 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>1-Klik Masuk sebagai Administrator DKP</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                CRUD
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-teal-400/50 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Fish className="w-4 h-4 text-teal-300 group-hover:scale-110 transition-transform" />
                <span>1-Klik Masuk sebagai Pengguna Publik</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-teal-400/20 text-teal-300 px-2 py-0.5 rounded border border-teal-400/30">
                Read-Only
              </span>
            </button>
          </div>

          {/* Bottom Security Note */}
          <div className="text-center pt-1 border-t border-white/10">
            <p className="text-xs text-slate-400 font-medium">
              Sistem resmi Dinas Kelautan & Perikanan Provinsi Sulawesi Utara
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
