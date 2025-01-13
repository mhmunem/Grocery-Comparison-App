import { IonIcon, IonButton } from '@ionic/react';
import { add, remove } from 'ionicons/icons';

export function QuantityControls({ decreaseQuantity, increaseQuantity, quantities, product }: any) {

    return (
        <div className="quantityControls">
            <IonButton
                shape="round"
                className="controlButton"
                aria-label="Decrease quantity"
                onClick={() => decreaseQuantity(product.id)}
                disabled={quantities[product.id] === 0} // Disable if quantity is 0
            >
                <IonIcon slot="icon-only" icon={remove} />
            </IonButton>

            <p className="quantityText">{quantities[product.id]}</p>

            <IonButton
                shape="round"
                className="controlButton"
                aria-label="Increase quantity"
                onClick={() => increaseQuantity(product.id)}
            >
                <IonIcon slot="icon-only" icon={add} />
            </IonButton>
        </div>
    );
}
