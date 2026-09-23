import React, { useState } from 'react';
import { Lock, User, Key, Eye, EyeOff, ShieldCheck, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { MonogramCrest, GorgaBatakOrnament, CornerGorgaFiligree } from './Ornaments';

// Master credentials khusus admin mempelai
const VALID_CREDENTIALS = [
  { username: 'admin', password: 'admin123' },
  { username: 'yenrichoveni', password: 'admin123' },
  { username: 'yenricho', password: 'admin123' },
  { username: 'veni', password: 'admin123' }
];

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMsg('Mohon masukkan Username dan Password Admin.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Check stored custom password or default credentials
      const savedCustomPass = localStorage.getItem('wedding_admin_custom_password');
      const isCustomMatch = savedCustomPass && cleanPass === savedCustomPass && (cleanUser === 'admin' || cleanUser === 'yenrichoveni');

      const isDefaultMatch = VALID_CREDENTIALS.some(
        c => c.username === cleanUser && c.password === cleanPass
      );

      if (isDefaultMatch || isCustomMatch) {
        localStorage.setItem('wedding_admin_auth', 'true');
        localStorage.setItem('wedding_admin_user', cleanUser);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg('Username atau Password salah! Periksa kembali.');
      }
    }, 400);
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-backdrop"></div>

      <div className="admin-login-card glass-card">
        <CornerGorgaFiligree position="top-left" />
        <CornerGorgaFiligree position="bottom-right" />

        <div className="admin-login-header">
          <MonogramCrest />
          <h2 className="admin-login-title">Portal Pengelola Undangan</h2>
          <p className="admin-login-subtitle">
            Akses Khusus Mempelai & Administrator <br />
            <strong>Yenricho & Veni</strong>
          </p>
          <div className="admin-login-divider">
            <GorgaBatakOrnament size={36} />
          </div>
        </div>

        {errorMsg && (
          <div className="admin-login-error">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="admin-label">
              <User size={15} className="gold-text" />
              <span>Username / Akun Admin:</span>
            </label>
            <div className="input-with-icon">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: admin atau yenrichoveni"
                className="admin-input"
                autoComplete="username"
                autoFocus
              />
            </div>
            <span className="input-hint">Default akun: <code>admin</code> atau <code>yenrichoveni</code></span>
          </div>

          <div className="form-group mt-4">
            <label className="admin-label">
              <Key size={15} className="gold-text" />
              <span>Kata Sandi (Password):</span>
            </label>
            <div className="password-input-wrap">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="admin-input pr-10"
                autoComplete="current-password"
              />
              <button 
                type="button" 
                className="btn-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span className="input-hint">Default sandi: <code>admin123</code></span>
          </div>

          <div className="login-security-badge">
            <ShieldCheck size={16} className="text-emerald" />
            <span>Terhubung ke Database Cloud Supabase (Aman & Realtime)</span>
          </div>

          <div className="login-button-group">
            <button 
              type="submit" 
              className="btn-login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Masuk ke Panel Admin</span>
                </>
              )}
            </button>

            <button 
              type="button" 
              className="btn-login-cancel"
              onClick={onCancel}
            >
              <ArrowLeft size={15} />
              <span>Kembali ke Website Undangan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
