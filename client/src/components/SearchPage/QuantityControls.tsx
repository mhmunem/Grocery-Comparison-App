import { IonIcon, IonButton } from '@ionic/react';
import { add, remove } from 'ionicons/icons';

export function QuantityControls({ decreaseQuantity, increaseQuantity, quantities, product }: any) {
    console.log("Quantities State:", quantities[product.store_products.productID]);
    return (
        <div className="quantityControls">
            <IonButton
                shape="round"
                className="controlButton"
                aria-label="Decrease quantity"
                onClick={() => decreaseQuantity(product.store_products.productID)}
            >
                <IonIcon slot="icon-only" icon={remove} />
            </IonButton>

            <p className="quantityText">{quantities[product.store_products.productID]}</p>

            <IonButton
                shape="round"
                className="controlButton"
                aria-label="Increase quantity"
                onClick={() => increaseQuantity(product.store_products.productID)}
            >
                <IonIcon slot="icon-only" icon={add} />
            </IonButton>
        </div>
    );
}
