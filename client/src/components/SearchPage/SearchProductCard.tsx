
import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonModal, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';
import { QuantityControls } from '../../components/SearchPage/QuantityControls';

export function SearchProductCard({decreaseQuantity, increaseQuantity, quantities, product, openProductDetails }:any) {
    return(
    <IonCard className="listCard">
        <IonImg
          src={product.thumbnailUrl}
          alt={product.title}
          className="productImage"
          onClick={() => openProductDetails(product)} />

        <IonCardContent>

          <IonCardTitle className="one-line-title" onClick={() => openProductDetails(product)}>
            {product.title}
          </IonCardTitle>

          <div className="productDetails">

            <div>
              <IonLabel className="brandSize">Brand</IonLabel>
              <IonLabel className="brandSize">100g</IonLabel>
            </div>

            <IonLabel className="priceLabel">$10.00</IonLabel>
            {quantities[product.id] > 0 ? (
            <QuantityControls 
            decreaseQuantity={decreaseQuantity} 
            increaseQuantity={increaseQuantity}
            quantities={quantities}
            product={product}
            />
            ) : (
              <IonButton onClick={() => increaseQuantity(product.id)} className="controlButton">
                Add to List
              </IonButton>

            )}

          </div>
        </IonCardContent>
      </IonCard>
      );
}

