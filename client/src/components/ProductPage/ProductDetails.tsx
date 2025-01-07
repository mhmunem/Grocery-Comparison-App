import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonModal, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';
import { QuantityControls } from '../../components/SearchPage/QuantityControls';

export function ProductDetails({ decreaseQuantity, increaseQuantity, quantities, selectedProduct }: any) {

    return (
        <IonRow>
            <IonImg src={selectedProduct.image} />
            <div className="productDetails">
                <div>
                    <IonLabel className="brandSize">Brand</IonLabel>
                    <IonLabel className="brandSize">100g</IonLabel>
                </div>

                <IonLabel className="priceLabel">{selectedProduct.price}</IonLabel>

                {quantities[selectedProduct.id] > 0 ? (
                    <QuantityControls
                        decreaseQuantity={decreaseQuantity}
                        increaseQuantity={increaseQuantity}
                        quantities={quantities}
                        product={selectedProduct}
                    />
                ) : (
                    <IonButton onClick={() => increaseQuantity(selectedProduct.id)} className="controlButton">
                        Add to List
                    </IonButton>

                )}
            </div>
        </IonRow>
    );
}