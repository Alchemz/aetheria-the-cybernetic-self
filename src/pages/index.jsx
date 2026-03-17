import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Layout from "./Layout.jsx";
import TempleLayout from "./TempleLayout.jsx";
import ProtectedRoute from "@/components/ProtectedRoute";

const LandingPage = React.lazy(() => import("./landing"));
const MasterPortal = React.lazy(() => import("./master-portal"));
const Wisdomwell = React.lazy(() => import("./wisdomwell"));
const NexusFrequencyLab = React.lazy(() => import("./nexus-frequency-lab"));
const NexusCosmicLibrary = React.lazy(() => import("./nexus-cosmic-library"));
const Account = React.lazy(() => import("./account"));
const NexusPinealAtrium = React.lazy(() => import("./nexus-pineal-atrium"));
const NexusBiohackingLab = React.lazy(() => import("./nexus-biohacking-lab"));
const Subscribe = React.lazy(() => import("./subscribe"));
const Heartwave = React.lazy(() => import("./heartwave"));
const AdminSetup = React.lazy(() => import("./admin-setup"));
const HeartwaveAthena = React.lazy(() => import("./heartwave-athena"));
const HeartwaveConsole = React.lazy(() => import("./heartwave-console"));
const Synchrony = React.lazy(() => import("./synchrony"));
const NexusOracle = React.lazy(() => import("./nexus-oracle"));

const PAGES = {
    landing: LandingPage,
    'master-portal': MasterPortal,
    wisdomwell: Wisdomwell,
    'nexus-frequency-lab': NexusFrequencyLab,
    'nexus-cosmic-library': NexusCosmicLibrary,
    account: Account,
    'nexus-pineal-atrium': NexusPinealAtrium,
    'nexus-biohacking-lab': NexusBiohackingLab,
    'nexus-oracle': NexusOracle,
    subscribe: Subscribe,
    heartwave: Heartwave,
    'admin-setup': AdminSetup,
    'heartwave-athena': HeartwaveAthena,
    'heartwave-console': HeartwaveConsole,
    synchrony: Synchrony,
};

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || 'landing';
}

function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    return (
        <Layout currentPageName={currentPage}>
            <Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center text-white font-[Orbitron] tracking-widest animate-pulse">INITIATING DATA STREAM...</div>}>
                <Routes>
                    {/* Free Pages - No Protection */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/portal" element={<MasterPortal />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/admin-setup" element={<AdminSetup />} />

                    {/* Unified Portal Experience */}
                    <Route path="/foundation" element={<ProtectedRoute><MasterPortal /></ProtectedRoute>} />
                    <Route path="/nexus" element={<ProtectedRoute><MasterPortal /></ProtectedRoute>} />
                    <Route path="/wisdomwell" element={<ProtectedRoute><Wisdomwell /></ProtectedRoute>} />
                    <Route path="/wisdom-well" element={<ProtectedRoute><Wisdomwell /></ProtectedRoute>} />
                    <Route path="/synchrony" element={<ProtectedRoute><Synchrony /></ProtectedRoute>} />

                    {/* Sub-modules remain separate for now until fully absorbed */}
                    <Route path="/nexus-frequency-lab" element={<ProtectedRoute><NexusFrequencyLab /></ProtectedRoute>} />
                    <Route path="/nexus-cosmic-library" element={<ProtectedRoute><NexusCosmicLibrary /></ProtectedRoute>} />
                    <Route path="/nexus-pineal-atrium" element={<ProtectedRoute><NexusPinealAtrium /></ProtectedRoute>} />
                    <Route path="/nexus-biohacking-lab" element={<ProtectedRoute><NexusBiohackingLab /></ProtectedRoute>} />
                    <Route path="/nexus-oracle" element={<ProtectedRoute><NexusOracle /></ProtectedRoute>} />

                    {/* Backward Compatibility Redirects */}
                    <Route path="/nexus-cosmic-observatory" element={<Navigate to="/nexus" replace />} />

                    {/* Temple Routes - Single persistent TempleLayout parent */}
                    <Route element={<ProtectedRoute><TempleLayout /></ProtectedRoute>}>
                        <Route path="/heartwave" element={<Heartwave />} />
                        <Route path="/heartwave-athena" element={<HeartwaveAthena />} />
                        <Route path="/heartwave-console" element={<HeartwaveConsole />} />
                    </Route>

                    <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
                </Routes>
            </Suspense>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}