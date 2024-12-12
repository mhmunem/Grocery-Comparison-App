import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';
import ExploreContainer from '../../components/SharedComponents/ExploreContainer';
import './SearchPage.css';

function SearchPage() {
  return (
    <IonPage>
      <IonHeader>
          <IonToolbar>
            <IonTitle>Search</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar showClearButton="always" animated={true}></IonSearchbar>
          </IonToolbar>
        </IonHeader>
      <IonContent fullscreen>
        <ExploreContainer name="Search page" />
      </IonContent>
    </IonPage>
  );
};

export default SearchPage;
