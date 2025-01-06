import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonModal, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';
import { add, remove, arrowForward, arrowBack, syncOutline } from 'ionicons/icons';

export function LoadingContainer(){
    return (
    <div className="loading-container">
        <IonIcon className="loading-spinner" icon={syncOutline} />
        <IonLabel className="loading-message">Fetching results...</IonLabel>
    </div>
    );
}
