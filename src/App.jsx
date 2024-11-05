import React, { useEffect, useState } from 'react';
import Header from './Header';
import ContactNotificationSection from './ContactNotificationSection';
import MapSection from './MapSection';
import './App.css';

function App() {
    const [crashData, setCrashData] = useState([]);
    const [currentDataIndex, setCurrentDataIndex] = useState(0);

    useEffect(() => {
        const fetchCrashData = async () => {
            try {
                const response = await fetch('https://n17cnnt1cl.execute-api.ap-south-1.amazonaws.com/prod/crashdata');
                const data = await response.json();
                setCrashData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCrashData();
        const interval = setInterval(fetchCrashData, 5000); // Fetch every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (crashData.length > 0) {
            const nextIndex = (currentDataIndex + 1) % crashData.length;
            setCurrentDataIndex(nextIndex);
        }
    }, [crashData, currentDataIndex]);

    const currentCrashData = crashData[currentDataIndex] || {};

    return (
        <div className="App">
            <Header />
            <main>
                <ContactNotificationSection notificationData={currentCrashData} />
                <MapSection crashData={currentCrashData} />
            </main>
        </div>
    );
}

export default App;
