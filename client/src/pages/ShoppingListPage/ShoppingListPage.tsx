import React, { useEffect, useState, useCallback } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonLabel, IonButton, IonItem } from '@ionic/react';
import { getSearch } from '../../services/InitialSetupService';
import { SearchProductCard } from '../../components/SearchPage/SearchProductCard';
import { ProductDetailsModal } from '../../components/ProductPage/ProductDetailsModal';
import './ShoppingListPage.css';
import { Product } from '../../types/product';

const ShoppingListPage: React.FC = () => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>({});
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSearch('', 'name', 'ASC');
        setProducts(result);
      } catch (err) {
        console.error('Error fetching products in ShoppingListPage:', err);
      }
    };
    fetchData();

    const savedQ = localStorage.getItem('quantities');
    const savedC = localStorage.getItem('addedToCart');

    if (savedQ && savedC) {
      setQuantities(JSON.parse(savedQ));
      setAddedToCart(JSON.parse(savedC));
    }
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      const savedQ = localStorage.getItem('quantities');
      const savedC = localStorage.getItem('addedToCart');
      if (savedQ && savedC) {
        setQuantities(JSON.parse(savedQ));
        setAddedToCart(JSON.parse(savedC));
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateCart = (newQuantities: { [key: string]: number }, newAddedToCart: { [key: string]: boolean }) => {
    localStorage.setItem('quantities', JSON.stringify(newQuantities));
    localStorage.setItem('addedToCart', JSON.stringify(newAddedToCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const increaseQuantity = useCallback(
    (productId: string | number) => {
      const storeIdStr = productId.toString();
      const newQuantities = { ...quantities };
      newQuantities[storeIdStr] = (newQuantities[storeIdStr] || 0) + 1;

      const newAddedToCart = { ...addedToCart };
      newAddedToCart[storeIdStr] = true;

      setQuantities(newQuantities);
      setAddedToCart(newAddedToCart);
      updateCart(newQuantities, newAddedToCart);
    },
    [quantities, addedToCart]
  );

  const decreaseQuantity = useCallback(
    (productId: string | number) => {
      const storeIdStr = productId.toString();
      const currentQuantity = quantities[storeIdStr] || 0;
      const newQuantity = Math.max(currentQuantity - 1, 0);

      const newQuantities = { ...quantities };
      newQuantities[storeIdStr] = newQuantity;

      const newAddedToCart = { ...addedToCart };
      newAddedToCart[storeIdStr] = newQuantity > 0;

      setQuantities(newQuantities);
      setAddedToCart(newAddedToCart);
      updateCart(newQuantities, newAddedToCart);
    },
    [quantities, addedToCart]
  );

  const removeItem = useCallback(
    (productId: string | number) => {
      const storeIdStr = productId.toString();
      const newQuantities = { ...quantities };
      newQuantities[storeIdStr] = 0;

      const newAddedToCart = { ...addedToCart };
      newAddedToCart[storeIdStr] = false;

      setQuantities(newQuantities);
      setAddedToCart(newAddedToCart);
      updateCart(newQuantities, newAddedToCart);
    },
    [quantities, addedToCart]
  );

  const cartProducts = products.filter((item) => {
    const storeIdStr = item.store_products.id.toString();
    return addedToCart[storeIdStr] && (quantities[storeIdStr] || 0) > 0;
  });

  const totalPrice = cartProducts.reduce((acc, item) => {
    const storeIdStr = item.store_products.id.toString();
    const q = quantities[storeIdStr] || 0;
    return acc + item.store_products.price * q;
  }, 0);

  const openProductDetails = (p: Product) => {
    setSelectedProduct(p);
    setShowProductDetails(true);
  };
  const closeProductDetails = () => {
    setShowProductDetails(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Shopping List</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="shopping-list-content">
        {cartProducts.length === 0 ? (
          <div className="empty-cart-message">
            <IonLabel>You have no products in your list.</IonLabel>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {cartProducts.map((product) => {
                const storeIdStr = product.store_products.id.toString();
                return (
                  <IonCol
                    size="6"
                    size-sm="4"
                    size-md="4"
                    size-lg="3"
                    key={product.store_products.id}
                    className="ion-no-margin"
                  >
                    <SearchProductCard
                      decreaseQuantity={decreaseQuantity}
                      increaseQuantity={increaseQuantity}
                      quantities={quantities}
                      product={product}
                      productID={product.store_products.id}
                      productBrand={product.products.brand}
                      productDetails={product.products.details}
                      productName={product.products.name}
                      productPrice={product.store_products.price}
                      productImage={product.products.image}
                      openProductDetails={openProductDetails}
                    />
                    <IonButton
                      color="danger"
                      onClick={() => removeItem(storeIdStr)}
                      style={{ marginTop: '8px', width: '100%' }}
                    >
                      Remove
                    </IonButton>
                  </IonCol>
                );
              })}
            </IonRow>
          </IonGrid>
        )}

        <ProductDetailsModal
          decreaseQuantity={decreaseQuantity}
          increaseQuantity={increaseQuantity}
          quantities={quantities}
          selectedProduct={selectedProduct}
          showProductDetails={showProductDetails}
          closeProductDetails={closeProductDetails}
        />
      </IonContent>

      {cartProducts.length > 0 && (
        <div className="total-price-container">
          <IonItem lines="none" className="total-price-item">
            <IonLabel>
              <strong>Total:</strong> ${totalPrice.toFixed(2)}
            </IonLabel>
          </IonItem>
        </div>
      )}
    </IonPage>
  );
};

export default ShoppingListPage;
