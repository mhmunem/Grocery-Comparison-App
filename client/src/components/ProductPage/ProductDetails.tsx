import { IonLabel, IonImg, IonRow, IonButton } from '@ionic/react';
import { QuantityControls } from '../../components/SearchPage/QuantityControls';

export function ProductDetails({ decreaseQuantity, increaseQuantity, quantities, selectedProduct }: any) { // TODO: fix any

    return (
        <IonRow>
            <IonImg src={selectedProduct.image} />
            <div className="productDetails">
                <div>
                    <IonRow>
                        <IonLabel className="brandText">Brand: {selectedProduct.products.brand}</IonLabel>
                    </IonRow>
                    <IonLabel className="sizeText">
                        {selectedProduct.units.name === 'ea'
                            ? '' // If the unit is 'ea', no amount or unit type is displayed
                            : `Weight/Volume: ${selectedProduct.products.amount}${selectedProduct.units.name}`}
                    </IonLabel>
                    <IonLabel className="sizeText">Unit Price:
                        {selectedProduct.units.name === 'ea'
                            ? `$${selectedProduct.store_products.price.toFixed(2)} ea` // Display price per item if unit is 'ea'
                            : `$${(selectedProduct.store_products.price / selectedProduct.products.amount).toFixed(2)} per ${selectedProduct.units.name}`}
                    </IonLabel>
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
