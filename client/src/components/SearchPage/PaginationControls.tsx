import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonModal, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';

import { add, remove, arrowForward, arrowBack, syncOutline } from 'ionicons/icons';

export function PaginationControls() {
    return (
        <div className="pagination">

            <IonButton shape="round" className="controlButton">
                <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
            </IonButton>

            <span>Page 1 of 5</span>
            <IonButton shape="round" className="controlButton">
                <IonIcon slot="icon-only" icon={arrowForward}></IonIcon>
            </IonButton>

        </div>
    );
}

