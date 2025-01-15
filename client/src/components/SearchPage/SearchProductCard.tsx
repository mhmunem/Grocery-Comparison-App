
import { IonCard, IonCardContent, IonLabel, IonImg, IonCardTitle, IonButton } from '@ionic/react';
import { QuantityControls } from '../../components/SearchPage/QuantityControls';

export function SearchProductCard({ 
    decreaseQuantity, 
    increaseQuantity, 
    quantities, 
    productBrand, 
    productID, 
    product, 
    productPrice,
    productName, 
    productImage, 
   openProductDetails
 }: any) {
    return (
        <IonCard className="listCard" onClick={() => {openProductDetails(product)
            console.log("openProductDetails (card):", product);
            
        }}>
            <IonImg
                src={productImage}
                alt={productName}
                className="productImage"
                 />

            <IonCardContent>

                <IonCardTitle className="one-line-title" onClick={() => openProductDetails(product.product)}>
                    {productName}
                </IonCardTitle>

                <div className="productDetails">

                    <div>
                        <IonLabel className="brandText">{product.products.brand}</IonLabel>
                        <IonLabel className="sizeText">{product.products.amount}{product.products.units.name}</IonLabel>
                    </div>

                    <IonLabel className="priceLabel">${productPrice}</IonLabel>
                    {quantities[product.store_products.productID] > 0 ? (
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
                        <IonButton className='add-to-list-button'
                            onClick={(event) => {
                                event.stopPropagation(); // Prevents opening details when clicking "Add to List"
                                increaseQuantity(product.store_products.productID);
                            }}

                        >
                            Add to List
                        </IonButton>

                    )}

                </div>
            </IonCardContent>
        </IonCard>
    );
}

