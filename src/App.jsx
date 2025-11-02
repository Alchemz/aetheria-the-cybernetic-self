import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from 'react'
import { subscriptionService } from '@/services/subscriptionService'

function App() {
  useEffect(() => {
    // Initialize RevenueCat on app startup
    subscriptionService.initialize().catch(err => {
      console.error('Failed to initialize subscription service:', err);
    });
  }, []);

  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App 