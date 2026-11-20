import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Live from "./pages/Live";
import Gestures from "./pages/Gestures";
import HistoryPage from "./pages/HistoryPage";
import About from "./pages/About";
export default function App() {
  return (<><Sidebar /><main className="p-4 pb-24 md:ml-60 md:p-8"><Routes>
    <Route path="/" element={<Dashboard />} /><Route path="/live" element={<Live />} /><Route path="/gestures" element={<Gestures />} />
    <Route path="/history" element={<HistoryPage />} /><Route path="/about" element={<About />} /></Routes></main></>);
}
