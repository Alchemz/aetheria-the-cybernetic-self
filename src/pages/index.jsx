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
                
                    <Route path="/" element={<Portal />} />
                
                
                <Route path="/foundation" element={<Foundation />} />
                
                <Route path="/portal" element={<Portal />} />
                
                <Route path="/wisdomwell" element={<Wisdomwell />} />
                
                <Route path="/wisdom-well" element={<Wisdomwell />} />
                
                <Route path="/nexus" element={<Nexus />} />
                
                <Route path="/nexus-frequency-lab" element={<NexusFrequencyLab />} />
                
                <Route path="/nexus-cosmic-library" element={<NexusCosmicLibrary />} />
                
                <Route path="/account" element={<Account />} />
                
                <Route path="/nexus-pineal-atrium" element={<NexusPinealAtrium />} />
                
                <Route path="/nexus-biohacking-lab" element={<NexusBiohackingLab />} />
                
                <Route path="/nexus-cosmic-observatory" element={<NexusCosmicObservatory />} />
                
                <Route path="/subscribe" element={<Subscribe />} />
                
                <Route path="/heartwave" element={<Heartwave />} />
                
                <Route path="/admin-setup" element={<AdminSetup />} />
                
                <Route path="/heartwave-protocols" element={<HeartwaveProtocols />} />
                
                <Route path="/heartwave-athena" element={<HeartwaveAthena />} />
                
                <Route path="/heartwave-console" element={<HeartwaveConsole />} />
                
                <Route path="/synchrony" element={<Synchrony />} />
                
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