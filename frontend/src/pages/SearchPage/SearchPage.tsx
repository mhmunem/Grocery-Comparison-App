import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';
import ExploreContainer from '../../components/SharedComponents/ExploreContainer';
import './SearchPage.css';
import React, { useState } from 'react';
import { add, remove } from 'ionicons/icons';

const SearchPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<any[]>([]);

  useIonViewWillEnter(async () => {
    const products = await getData();
    console.log('SearchPage.tsx ~ useIonViewWillEnter ~ products:',  products);
    setProducts(products);
    setLoading(false);
  });

  const getData = async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/photos');
    const products = await data.json();
    return products;
  };

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
      <IonContent>
        {products.map((product, index) => (
          <IonCard key={index} className="listCard">
            <IonCardContent className="ion-no-padding">
              <IonItem lines='none'>
                <IonImg slot="start"
                  src={product.thumbnailUrl}
                ></IonImg>
                <IonGrid>
                  <IonRow>
                    <IonCol size="8">
                      <IonCardTitle className="one-line-title">
                        {product.title}
                      </IonCardTitle>
                    </IonCol>
                    <IonCol>
                      <IonLabel class="ion-text-right">
                        $10.00
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonRow>
                        Brand
                      </IonRow>
                      <IonRow>
                        100g
                      </IonRow>
                    </IonCol>
                    <IonCol class="ion-text-right">
                      <IonItem lines='none' >
                        <IonButton shape="round" style={{ minWidth: '22px', margin:"15px"}}><IonIcon slot="icon-only" icon={remove}></IonIcon></IonButton>
                        <p>0</p>                   
                        <IonButton shape="round" style={{ minWidth: '22px', margin:"15px"}}><IonIcon slot="icon-only" icon={add}></IonIcon></IonButton>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default SearchPage;
