import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonThumbnail,
  IonImg,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonModal,
  IonButtons,
  useIonViewWillEnter, 
} from '@ionic/react';

import './ShoppingListPage.css';
import React, { useState, useEffect } from 'react';
import { add, remove, trash, syncOutline } from 'ionicons/icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceHistory {
  date: Date;
  price: number;
}

interface PriceHistoryData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }>;
}

interface CartItem {
  product: any;
  quantity: number;
}

const ShoppingListPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [dailyPriceHistory, setDailyPriceHistory] = useState<PriceHistory[]>([]);
  const [filteredPriceHistory, setFilteredPriceHistory] = useState<PriceHistory[]>([]);
  const [timeRange, setTimeRange] = useState('3M');
  const [priceHistoryData, setPriceHistoryData] = useState<PriceHistoryData>({
    labels: [],
    datasets: [],
  });

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  useIonViewWillEnter(() => {
    loadCart();
  });

  const loadCart = async () => {
    setLoading(true);
    try {
      const addedToCart = localStorage.getItem('addedToCart');
      const quantities = localStorage.getItem('quantities');
      const addedToCartParsed = addedToCart ? JSON.parse(addedToCart) : {};
      const quantitiesParsed = quantities ? JSON.parse(quantities) : {};

      const productIds = Object.keys(addedToCartParsed).filter((key) => addedToCartParsed[key]);

      if (productIds.length === 0) {
        setCartItems([]);
        setTotalPrice(0);
        setLoading(false);
        return;
      }

      const response = await fetch('https://jsonplaceholder.typicode.com/photos?albumId=2');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();

      const filteredProducts = products.filter((p: any) =>
        productIds.includes(p.id.toString())
      );

      const items: CartItem[] = filteredProducts.map((p: any) => ({
        product: p,
        quantity: quantitiesParsed[p.id] || 1,
      }));

      setCartItems(items);

      const total = items.reduce((sum, item) => sum + item.quantity * 10, 0);
      setTotalPrice(total);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const generateDummyData = () => {
      const today = new Date();
      const prices: PriceHistory[] = [];
      for (let i = 0; i < 365; i++) {
        const randomPrice = 10 + Math.random() * 5;
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        prices.push({ date, price: parseFloat(randomPrice.toFixed(2)) });
      }
      prices.reverse();
      setDailyPriceHistory(prices);
    };
    generateDummyData();
  }, []);

  useEffect(() => {
    const filterDataByRange = () => {
      const ranges: Record<string, number> = {
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '12M': 365,
      };
      const days = ranges[timeRange] || 365;
      const filtered = dailyPriceHistory.slice(-days);
      setFilteredPriceHistory(filtered);
    };
    filterDataByRange();
  }, [timeRange, dailyPriceHistory]);

  
  useEffect(() => {
    const chartLabels = filteredPriceHistory.map((entry) =>
      entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const chartData = filteredPriceHistory.map((entry) => entry.price);

    setPriceHistoryData({
      labels: chartLabels,
      datasets: [
        {
          label: 'Price History',
          data: chartData,
          borderColor: '#7371FC',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.4,
        },
      ],
    });
  }, [filteredPriceHistory]);

  
  const openProductDetails = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const closeProductDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  
  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      const newCartItems = prevItems.map((item) =>
        item.product.id.toString() === productId ? { ...item, quantity } : item
      );

      const storedQuantities = localStorage.getItem('quantities');
      const quantitiesParsed = storedQuantities ? JSON.parse(storedQuantities) : {};

      if (quantity > 0) {
        quantitiesParsed[productId] = quantity;
      } else {
        delete quantitiesParsed[productId];
        const storedAddedToCart = localStorage.getItem('addedToCart');
        const addedToCartParsed = storedAddedToCart ? JSON.parse(storedAddedToCart) : {};
        delete addedToCartParsed[productId];
        localStorage.setItem('addedToCart', JSON.stringify(addedToCartParsed));
      }
      localStorage.setItem('quantities', JSON.stringify(quantitiesParsed));

      const newTotal = newCartItems.reduce((sum, item) => sum + item.quantity * 10, 0);
      setTotalPrice(newTotal);

      return newCartItems;
    });
  };

  const removeItem = (productId: string) => {
    setCartItems((prevItems) => {
      const newCartItems = prevItems.filter((item) => item.product.id.toString() !== productId);

      const storedAddedToCart = localStorage.getItem('addedToCart');
      const addedToCartParsed = storedAddedToCart ? JSON.parse(storedAddedToCart) : {};
      delete addedToCartParsed[productId];
      localStorage.setItem('addedToCart', JSON.stringify(addedToCartParsed));

      const storedQuantities = localStorage.getItem('quantities');
      const quantitiesParsed = storedQuantities ? JSON.parse(storedQuantities) : {};
      delete quantitiesParsed[productId];
      localStorage.setItem('quantities', JSON.stringify(quantitiesParsed));

      const newTotal = newCartItems.reduce((sum, item) => sum + item.quantity * 10, 0);
      setTotalPrice(newTotal);

      return newCartItems;
    });
  };

 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Shopping List</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading ? (
          <div className="loading-container">
            <IonIcon className="loading-spinner" icon={syncOutline} />
            <IonLabel className="loading-message">Loading your cart...</IonLabel>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="no-results-container">
            <IonLabel>Your cart is empty.</IonLabel>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-md="8">
                <IonList>
                  {cartItems.map((item) => (
                    <IonItem key={item.product.id} className="cart-item">
                      <IonThumbnail
                        slot="start"
                        onClick={() => openProductDetails(item.product)}
                        style={{ cursor: 'pointer' }}
                      >
                        <IonImg src={item.product.thumbnailUrl} alt={item.product.title} />
                      </IonThumbnail>

                      <IonLabel>
                        <h2>{item.product.title}</h2>
                        <p>Price: $10.00</p>
                        <div className="quantityControls">
                          <IonButton
                            shape="round"
                            className="controlButton"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.product.id.toString(), item.quantity - 1)}
                            disabled={item.quantity === 1}
                          >
                            <IonIcon slot="icon-only" icon={remove} />
                          </IonButton>
                          <p className="quantityText">{item.quantity}</p>
                          <IonButton
                            shape="round"
                            className="controlButton"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.product.id.toString(), item.quantity + 1)}
                          >
                            <IonIcon slot="icon-only" icon={add} />
                          </IonButton>
                        </div>
                      </IonLabel>

                      <IonButton
                        fill="clear"
                        color="danger"
                        onClick={() => removeItem(item.product.id.toString())}
                      >
                        <IonIcon icon={trash} />
                      </IonButton>
                    </IonItem>
                  ))}
                </IonList>
              </IonCol>

              <IonCol size="12" size-md="4">
                <IonCard>
                  <IonCardContent>
                    <IonCardTitle>Total: ${totalPrice.toFixed(2)}</IonCardTitle>
                    {/* 
                    <IonButton expand="block" color="primary" onClick={() => alert('Checkout logic')}>
                      Proceed to Checkout
                    </IonButton> 
                    */}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

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
                  <h2>{selectedProduct.title}</h2>
                </IonRow>

                <IonRow>
                  <IonImg src={selectedProduct.thumbnailUrl} />
                  <div className="productDetails" style={{ marginLeft: '16px' }}>
                    <div>
                      <IonLabel className="brandSize">Brand: Some Brand</IonLabel>
                      <IonLabel className="brandSize">100g</IonLabel>
                    </div>
                    <IonLabel className="priceLabel">$10.00</IonLabel>
                  </div>
                </IonRow>

                <IonRow>
                  <Line data={priceHistoryData} />
                </IonRow>

                <IonRow style={{ justifyContent: 'center', marginBottom: '16px', marginTop: '16px' }}>
                  {['1M', '3M', '6M', '12M'].map((range) => (
                    <IonButton
                      key={range}
                      color={timeRange === range ? 'primary' : 'medium'}
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </IonButton>
                  ))}
                </IonRow>

                <IonRow>
                  <IonLabel>
                    <h1>Description</h1>
                    <p>
                      This is a sample description, just like the SearchPage has a paragraph or two.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </IonLabel>
                </IonRow>
              </div>
            ) : (
              <p>Loading product details...</p>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ShoppingListPage;
