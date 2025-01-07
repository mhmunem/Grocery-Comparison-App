import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonModal, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';
import { ProductDetails } from '../../components/ProductPage/ProductDetails';
import { PriceHistory } from '../../components/ProductPage/PriceHistory';

export function ProductDetailsModal({ decreaseQuantity, increaseQuantity, quantities, selectedProduct, showProductDetails, closeProductDetails }: any) {
    return (

        <IonModal isOpen={showProductDetails} onDidDismiss={closeProductDetails}>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton onClick={closeProductDetails}>Close</IonButton>
                    </IonButtons>
                    <IonTitle>Product Details</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {selectedProduct ? (
                    <div style={{ padding: '16px' }}>
                        <IonRow>
                            <h2>{selectedProduct.name}</h2>
                        </IonRow>
                        <ProductDetails
                            decreaseQuantity={decreaseQuantity}
                            increaseQuantity={increaseQuantity}
                            quantities={quantities}
                            selectedProduct={selectedProduct}
                        />
                        <PriceHistory
                            product={selectedProduct}
                        />
                        <IonLabel>
                            <h1>Description</h1>
                            <p>Paragraph Paragraph Paragraph Paragraph ParagraphParagraph Paragraph Paragraph Paragraph Paragraph</p>
                        </IonLabel>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </IonContent>
        </IonModal>
    )
}