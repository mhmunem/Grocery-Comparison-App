
import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonModal, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';
import { QuantityControls } from '../../components/SearchPage/QuantityControls';

export function SearchProductCard({ decreaseQuantity, increaseQuantity, quantities, product, openProductDetails }: any) {
    return (
        <IonCard className="listCard" onClick={() => openProductDetails(product)}>
            <IonImg
                src={product.image}
                alt={product.name}
                className="productImage"
                 />

            <IonCardContent>

                <IonCardTitle className="one-line-title" onClick={() => openProductDetails(product)}>
                    {product.name}
                </IonCardTitle>

                <div className="productDetails">

                    <div>
                        <IonLabel className="brandSize">Brand</IonLabel>
                        <IonLabel className="brandSize">100g</IonLabel>
                    </div>

                    <IonLabel className="priceLabel">${product.price}</IonLabel>
                    {quantities[product.id] > 0 ? (
                        <div
                            onClick={(event) => event.stopPropagation()} // Prevents opening details when interacting with quantity controls
                        >
                            <QuantityControls
                                decreaseQuantity={decreaseQuantity}
                                increaseQuantity={increaseQuantity}
                                quantities={quantities}
                                product={product}
                            />
                        </div>
                    ) : (
                        <IonButton
                            onClick={(event) => {
                                event.stopPropagation(); // Prevents opening details when clicking "Add to List"
                                increaseQuantity(product.id);
                            }}
                            className="controlButton"
                        >
                            Add to List
                        </IonButton>

                    )}

                </div>
            </IonCardContent>
        </IonCard>
    );
}

