import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonModal, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';
import { QuantityControls } from '../../components/SearchPage/QuantityControls';

export function ProductDetails({ decreaseQuantity, increaseQuantity, quantities, selectedProduct }: any) {

    return (
        <IonRow>
            <IonImg src={selectedProduct.image} />
            <div className="productDetails">
                <div>
                    <IonRow>
                    <IonLabel className="brandText">Brand: {selectedProduct.products.brand}</IonLabel>
                    </IonRow>
                    <IonRow>
                    <IonLabel className="sizeText">Size: {selectedProduct.products.amount} {selectedProduct.units.name}</IonLabel>
                    </IonRow>
                    <IonRow>
                    <IonLabel className="sizeText">Category: {selectedProduct.category.name}</IonLabel>
                    </IonRow>
                    <IonRow>
                    <IonLabel className="priceLabel">${selectedProduct.store_products.price}</IonLabel>
                    </IonRow>
                

                

                {quantities[selectedProduct.store_products.id] > 0 ? (
                    <QuantityControls
                        decreaseQuantity={decreaseQuantity}
                        increaseQuantity={increaseQuantity}
                        quantities={quantities}
                        product={selectedProduct}
                    />
                ) : (
                    <IonButton className='add-to-list-button' onClick={() => increaseQuantity(selectedProduct.store_products.id)}>
                        Add to List
                    </IonButton>

                )}
                </div>
            </div>
        </IonRow>
    );
}