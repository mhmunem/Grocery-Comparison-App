
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
        <IonCard className="listCard" onClick={() => {
            openProductDetails(product)

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
                        <IonLabel className="sizeText">{product.products.amount} {product.units.name}</IonLabel>
                        <IonLabel className="sizeText">
                        {product.units.name === 'ea'
                            ? `` // Display price per item if unit is 'ea'
                            : `$${(product.store_products.price / product.products.amount).toFixed(2)}/${product.units.name}`}
                    </IonLabel>

                    </div>

                    <IonLabel className="priceLabel">${productPrice.toFixed(2)}</IonLabel>
                    {quantities[product.store_products.id] > 0 ? (
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
                                increaseQuantity(product.store_products.id);
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

