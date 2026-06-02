import React from 'react';

// Bắt lỗi render để KHÔNG bao giờ hiện trang trắng — thay vào đó là thông báo thân thiện.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Lỗi ứng dụng:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetLocal = () => {
    try {
      // Xóa dữ liệu cục bộ (phòng trường hợp dữ liệu lưu bị hỏng) rồi tải lại
      Object.keys(localStorage)
        .filter((k) => k.startsWith('hdndthkpi_state'))
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Không xóa được localStorage:', e);
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontFamily: "'Segoe UI', system-ui, sans-serif", padding: 16 }}>
        <div style={{ maxWidth: 520, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28, boxShadow: '0 10px 30px rgba(0,0,0,.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚠️</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Đã xảy ra lỗi hiển thị</h1>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 18px' }}>
            Rất tiếc, giao diện gặp sự cố. Dữ liệu của bạn vẫn được lưu an toàn. Hãy thử tải lại trang.
            Nếu vẫn lỗi, dùng nút "Xóa dữ liệu cục bộ" để khôi phục (dữ liệu trên máy chủ không bị ảnh hưởng).
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={this.handleReload} style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Tải lại trang</button>
            <button onClick={this.handleResetLocal} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Xóa dữ liệu cục bộ &amp; tải lại</button>
          </div>
          {this.state.error?.message && (
            <pre style={{ marginTop: 18, textAlign: 'left', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 10, fontSize: 11, color: '#64748b', overflow: 'auto', maxHeight: 140 }}>{String(this.state.error.message)}</pre>
          )}
        </div>
      </div>
    );
  }
}
