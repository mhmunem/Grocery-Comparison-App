import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/SharedComponents/ExploreContainer';
import './ShoppingListPage.css';

function ShoppingListPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ShoppingList</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">ShoppingList</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="ShoppingList page" />
      </IonContent>
    </IonPage>
  );
};

export default ShoppingListPage;
