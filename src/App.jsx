import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './pages/MenuPage';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* igual que el catálogo: /c/<slug-del-cliente> */}
				<Route path="/c/:slug" element={<MenuPage />} />
				{/* modo prueba: /?commerceId=2820 */}
				<Route path="/" element={<MenuPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
