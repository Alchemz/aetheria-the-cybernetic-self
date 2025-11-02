import Layout from "./Layout.jsx";

import Foundation from "./foundation";

import Portal from "./portal";

import Wisdomwell from "./wisdomwell";

import Nexus from "./nexus";

import NexusFrequencyLab from "./nexus-frequency-lab";

import NexusCosmicLibrary from "./nexus-cosmic-library";

import Account from "./account";

import NexusPinealAtrium from "./nexus-pineal-atrium";

import NexusBiohackingLab from "./nexus-biohacking-lab";

import NexusCosmicObservatory from "./nexus-cosmic-observatory";

import Subscribe from "./subscribe";

import Heartwave from "./heartwave";

import AdminSetup from "./admin-setup";

import HeartwaveProtocols from "./heartwave-protocols";

import HeartwaveAthena from "./heartwave-athena";

import HeartwaveConsole from "./heartwave-console";

import Synchrony from "./synchrony";

import Upgrade from "./upgrade";

import ProtectedRoute from "@/components/ProtectedRoute";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    foundation: Foundation,
    
    portal: Portal,
    
    wisdomwell: Wisdomwell,
    
    nexus: Nexus,
    
    'nexus-frequency-lab': NexusFrequencyLab,
    
    'nexus-cosmic-library': NexusCosmicLibrary,
    
    account: Account,
    
    'nexus-pineal-atrium': NexusPinealAtrium,
    
    'nexus-biohacking-lab': NexusBiohackingLab,
    
    'nexus-cosmic-observatory': NexusCosmicObservatory,
    
    subscribe: Subscribe,
    
    heartwave: Heartwave,
    
    'admin-setup': AdminSetup,
    
    'heartwave-protocols': HeartwaveProtocols,
    
    'heartwave-athena': HeartwaveAthena,
    
    'heartwave-console': HeartwaveConsole,
    
    synchrony: Synchrony,
    
    upgrade: Upgrade,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                {/* Free Pages - No Protection */}
                <Route path="/" element={<Portal />} />
                <Route path="/portal" element={<Portal />} />
                <Route path="/wisdomwell" element={<Wisdomwell />} />
                <Route path="/wisdom-well" element={<Wisdomwell />} />
                <Route path="/synchrony" element={<Synchrony />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin-setup" element={<AdminSetup />} />
                
                {/* Paid Pages - Protected */}
                <Route path="/foundation" element={<ProtectedRoute><Foundation /></ProtectedRoute>} />
                <Route path="/nexus" element={<ProtectedRoute><Nexus /></ProtectedRoute>} />
                <Route path="/nexus-frequency-lab" element={<ProtectedRoute><NexusFrequencyLab /></ProtectedRoute>} />
                <Route path="/nexus-cosmic-library" element={<ProtectedRoute><NexusCosmicLibrary /></ProtectedRoute>} />
                <Route path="/nexus-pineal-atrium" element={<ProtectedRoute><NexusPinealAtrium /></ProtectedRoute>} />
                <Route path="/nexus-biohacking-lab" element={<ProtectedRoute><NexusBiohackingLab /></ProtectedRoute>} />
                <Route path="/nexus-cosmic-observatory" element={<ProtectedRoute><NexusCosmicObservatory /></ProtectedRoute>} />
                <Route path="/heartwave" element={<ProtectedRoute><Heartwave /></ProtectedRoute>} />
                <Route path="/heartwave-protocols" element={<ProtectedRoute><HeartwaveProtocols /></ProtectedRoute>} />
                <Route path="/heartwave-athena" element={<ProtectedRoute><HeartwaveAthena /></ProtectedRoute>} />
                <Route path="/heartwave-console" element={<ProtectedRoute><HeartwaveConsole /></ProtectedRoute>} />
                <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
            </Routes>
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