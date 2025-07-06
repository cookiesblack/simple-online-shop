import './globals.css';
import DynamicNavbar from '@/components/DynamicNavbar';

export const metadata = {
  title: 'Simple Shop',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <DynamicNavbar /> {/* ✅ Komponen Client di dalam body */}
        {children}
      </body>
    </html>
  );
}
