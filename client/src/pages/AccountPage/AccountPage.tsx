import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg } from '@ionic/react';
import ExploreContainer from '../../components/SharedComponents/ExploreContainer';
import './AccountPage.css';

function AccountPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <div className="title-center">
            <IonImg
              src="680logocropped.png"
              alt="App Logo"
              class='headerLogo'
            />
          </div>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Account page" />
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
