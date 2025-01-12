import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonModal, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';

import { add, remove, arrowForward, arrowBack, syncOutline } from 'ionicons/icons';

export function PaginationControls({ currentPage, totalPages, nextPage, prevPage, goToPage, }: any) {
  return (
    <div className="pagination">

      <IonButton onClick={prevPage} shape="round" className="controlButton" disabled={currentPage === 1}>
        <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
      </IonButton>
      {[...Array(totalPages)].map((_, index) => (
        <IonButton
          key={index}
          onClick={() => goToPage(index + 1)}
          color={currentPage === index + 1 ? 'primary' : 'light'}
        >
          {index + 1}
        </IonButton>
      ))}
      <IonButton onClick={nextPage} shape="round" className="controlButton" disabled={currentPage === totalPages}>
        <IonIcon slot="icon-only" icon={arrowForward}></IonIcon>
      </IonButton>

    </div>
  );
}
