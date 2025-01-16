import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg } from '@ionic/react';
import './HomePage.css';
import { useEffect, useState } from 'react';
import { getInitialSetupMessage } from '../../services/InitialSetupService';


function HomePage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // server connection Testing using GET on initial load
        getInitialSetupMessage().then((response: any) => {
            setData(response);
        })
            .catch((error: any) => {
                console.error('Error fetching GET data:', error);
            });
    }, []);


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <div className="title-center">
                        <IonImg
                            src="680logocropped.png"
                            alt="App Logo"
                            className='headerLogo'
                        />
                        <IonTitle slot="end" >Home</IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Home</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="container">
                    <div>
                        <div>{JSON.stringify(data)}</div>
                    </div>
                </div>
            </IonContent>
        </IonPage >
    );
};

export default HomePage;
