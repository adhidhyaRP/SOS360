import React, { useState, useEffect } from 'react';
import './App.css';

function ContactNotificationSection() {
    const [contacts, setContacts] = useState([]);
    const [contactName, setContactName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [notificationVisible, setNotificationVisible] = useState(true);
    const [responseInfo, setResponseInfo] = useState(null);
    const [accidentData, setAccidentData] = useState(null);

    // Function to fetch data from the API
    const fetchAccidentData = async () => {
        try {
            const response = await fetch('https://n17cnnt1cl.execute-api.ap-south-1.amazonaws.com/prod/crashdata');
            const data = await response.json();
            setAccidentData(data[Math.floor(Math.random() * data.length)]); // Randomize data for each 5 seconds interval
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Fetch new data every 5 seconds
    useEffect(() => {
        fetchAccidentData(); // Initial fetch
        const interval = setInterval(fetchAccidentData, 5000); // Fetch every 5 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const addContact = () => {
        if (contactName && contactNumber) {
            setContacts([...contacts, { name: contactName, number: contactNumber }]);
            setContactName('');
            setContactNumber('');
        }
    };

    const acceptNotification = () => {
        setResponseInfo({ time: "10 minutes", distance: "5 km" });
        setNotificationVisible(false);
    };

    const declineNotification = () => {
        setNotificationVisible(false);
        setResponseInfo({ declined: true });
    };

    return (
        <section id="contact-notification-section">
            <div id="contact-section">
                <h2>Emergency Contacts</h2>
                <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact Name"
                />
                <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Phone Number"
                />
                <button onClick={addContact}>Add</button>
                <ul id="contact-list">
                    {contacts.map((contact, index) => (
                        <li key={index}>
                            {contact.name} ({contact.number})
                            <button onClick={() => setContacts(contacts.filter((_, i) => i !== index))}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div id="notification-section">
                <h2>Notifications</h2>
                {notificationVisible && accidentData && (
                    <div id="notification-box">
                        <p>{accidentData.payload.Message}</p>
                        <p>Latitude: {accidentData.payload.latitude}</p>
                        <p>Longitude: {accidentData.payload.longitude}</p>
                        <button onClick={acceptNotification} id="accept-notification">Accept</button>
                        <button onClick={declineNotification} id="decline-notification">Decline</button>
                    </div>
                )}
                {responseInfo && (
                    <div id="response-info">
                        {responseInfo.declined ? (
                            <p style={{ color: "#e74c3c" }}>You could have saved someone's life.</p>
                        ) : (
                            <>
                                <p>Time to reach victim: <span>{responseInfo.time}</span></p>
                                <p>Distance to victim: <span>{responseInfo.distance}</span></p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ContactNotificationSection;
