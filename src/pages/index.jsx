import Layout from "./Layout.jsx";

import foundation from "./foundation";

import portal from "./portal";

import wisdomwell from "./wisdomwell";

import nexus from "./nexus";

import nexus-frequency-lab from "./nexus-frequency-lab";

import nexus-cosmic-library from "./nexus-cosmic-library";

import account from "./account";

import nexus-pineal-atrium from "./nexus-pineal-atrium";

import nexus-biohacking-lab from "./nexus-biohacking-lab";

import nexus-cosmic-observatory from "./nexus-cosmic-observatory";

import subscribe from "./subscribe";

import heartwave from "./heartwave";

import admin-setup from "./admin-setup";

import heartwave-protocols from "./heartwave-protocols";

import heartwave-athena from "./heartwave-athena";

import heartwave-console from "./heartwave-console";

import synchrony from "./synchrony";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    foundation: foundation,
    
    portal: portal,
    
    wisdomwell: wisdomwell,
    
    nexus: nexus,
    
    nexus-frequency-lab: nexus-frequency-lab,
    
    nexus-cosmic-library: nexus-cosmic-library,
    
    account: account,
    
    nexus-pineal-atrium: nexus-pineal-atrium,
    
    nexus-biohacking-lab: nexus-biohacking-lab,
    
    nexus-cosmic-observatory: nexus-cosmic-observatory,
    
    subscribe: subscribe,
    
    heartwave: heartwave,
    
    admin-setup: admin-setup,
    
    heartwave-protocols: heartwave-protocols,
    
    heartwave-athena: heartwave-athena,
    
    heartwave-console: heartwave-console,
    
    synchrony: synchrony,
    
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
                
                    <Route path="/" element={<foundation />} />
                
                
                <Route path="/foundation" element={<foundation />} />
                
                <Route path="/portal" element={<portal />} />
                
                <Route path="/wisdomwell" element={<wisdomwell />} />
                
                <Route path="/nexus" element={<nexus />} />
                
                <Route path="/nexus-frequency-lab" element={<nexus-frequency-lab />} />
                
                <Route path="/nexus-cosmic-library" element={<nexus-cosmic-library />} />
                
                <Route path="/account" element={<account />} />
                
                <Route path="/nexus-pineal-atrium" element={<nexus-pineal-atrium />} />
                
                <Route path="/nexus-biohacking-lab" element={<nexus-biohacking-lab />} />
                
                <Route path="/nexus-cosmic-observatory" element={<nexus-cosmic-observatory />} />
                
                <Route path="/subscribe" element={<subscribe />} />
                
                <Route path="/heartwave" element={<heartwave />} />
                
                <Route path="/admin-setup" element={<admin-setup />} />
                
                <Route path="/heartwave-protocols" element={<heartwave-protocols />} />
                
                <Route path="/heartwave-athena" element={<heartwave-athena />} />
                
                <Route path="/heartwave-console" element={<heartwave-console />} />
                
                <Route path="/synchrony" element={<synchrony />} />
                
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