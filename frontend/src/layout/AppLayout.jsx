
import Header from '../components/Header';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />

      <main className="app-content">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
