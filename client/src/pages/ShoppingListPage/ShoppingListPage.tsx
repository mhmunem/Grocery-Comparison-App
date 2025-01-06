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

  // 价格历史数据
  const [priceHistoryData, setPriceHistoryData] = useState<PriceHistoryData>({
    labels: [],
    datasets: [],
  });

  // 从 localStorage 加载购物车数据
  useEffect(() => {
     const loadCart = async () => {
      setLoading(true);
      try {
        const addedToCart = localStorage.getItem('addedToCart');
        const quantities = localStorage.getItem('quantities');
        const addedToCartParsed = addedToCart ? JSON.parse(addedToCart) : {};
        const quantitiesParsed = quantities ? JSON.parse(quantities) : {};

        // 获取所有添加到购物车的商品ID
        const productIds = Object.keys(addedToCartParsed).filter((key) => addedToCartParsed[key]);

        if (productIds.length === 0) {
          setCartItems([]);
          setTotalPrice(0);
          setLoading(false);
          return;
        }

        // 获取商品详情（假设与 SearchPage 使用相同的 API）
        const response = await fetch('https://jsonplaceholder.typicode.com/photos?albumId=2');
        if (!response.ok) {
          // 修复这里的语法：用反引号
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();

        // 过滤出购物车中的商品
        const filteredProducts = products.filter((product: any) => 
          productIds.includes(product.id.toString())
        );

        // 构建购物车项
        const items: CartItem[] = filteredProducts.map((product: any) => ({
          product,
          quantity: quantitiesParsed[product.id] || 1,
        }));

        setCartItems(items);

        // 计算总价（假设每个商品价格为 $10.00）
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

    loadCart();
  }, []);

  /**
   * 更新购物车中的商品数量
   * - 使用“内联更新”来确保 totalPrice 立刻获得最新的 cartItems
   */
  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      // 1. 根据 prevItems 生成新的 cartItems 数组
      const newCartItems = prevItems.map((item) =>
        item.product.id.toString() === productId
          ? { ...item, quantity }
          : item
      );

      // 2. 更新 localStorage
      const storedQuantities = localStorage.getItem('quantities');
      const quantitiesParsed = storedQuantities ? JSON.parse(storedQuantities) : {};

      if (quantity > 0) {
        quantitiesParsed[productId] = quantity;
      } else {
        // 数量变为0时，需移除该商品
        delete quantitiesParsed[productId];
        const storedAddedToCart = localStorage.getItem('addedToCart');
        const addedToCartParsed = storedAddedToCart ? JSON.parse(storedAddedToCart) : {};
        delete addedToCartParsed[productId];
        localStorage.setItem('addedToCart', JSON.stringify(addedToCartParsed));
      }
      localStorage.setItem('quantities', JSON.stringify(quantitiesParsed));

      // 3. 计算新的 totalPrice
      const newTotal = newCartItems.reduce((sum, item) => sum + item.quantity * 10, 0);
      setTotalPrice(newTotal);

      console.log('Called updateQuantity with productId=', productId, 'quantity=', quantity);
      console.log('newCartItems=', newCartItems);
      console.log('newTotalprice=', newTotal);
      // 4. 返回新 cartItems 供 setCartItems 更新状态
      return newCartItems;
    });
  };

  /**
   * 从购物车移除商品
   */
  const removeItem = (productId: string) => {
    setCartItems((prevItems) => {
      // 1. 生成新的 cartItems（去掉某商品）
      const newCartItems = prevItems.filter((item) => item.product.id.toString() !== productId);

      // 2. 更新 localStorage
      const storedAddedToCart = localStorage.getItem('addedToCart');
      const addedToCartParsed = storedAddedToCart ? JSON.parse(storedAddedToCart) : {};
      delete addedToCartParsed[productId];
      localStorage.setItem('addedToCart', JSON.stringify(addedToCartParsed));

      const storedQuantities = localStorage.getItem('quantities');
      const quantitiesParsed = storedQuantities ? JSON.parse(storedQuantities) : {};
      delete quantitiesParsed[productId];
      localStorage.setItem('quantities', JSON.stringify(quantitiesParsed));

      // 3. 计算新的 totalPrice
      const newTotal = newCartItems.reduce((sum, item) => sum + item.quantity * 10, 0);
      setTotalPrice(newTotal);

      // 4. 返回新的 cartItems
      return newCartItems;
    });
  };

  // 生成假数据的价格历史
  useEffect(() => {
    const generateDummyPriceHistory = () => {
      const today = new Date();
      const labels: string[] = [];
      const data: number[] = [];
      for (let i = 0; i < 30; i++) { // 最近30天
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        labels.unshift(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        data.unshift(10 + Math.random() * 5);
      }

      const chartData: PriceHistoryData = {
        labels,
        datasets: [
          {
            label: 'Price History',
            data,
            borderColor: '#7371FC',
            backgroundColor: 'rgba(75,192,192,0.2)',
            tension: 0.4,
          },
        ],
      };

      setPriceHistoryData(chartData);
    };

    generateDummyPriceHistory();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Shopping Cart</IonTitle>
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
                      <IonThumbnail slot="start">
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
                    <IonButton expand="block" color="primary" onClick={() => alert('Proceeding to checkout...')}>
                      Proceed to Checkout
                    </IonButton>
                  </IonCardContent>
                </IonCard>
                <IonCard>
                  <IonCardContent>
                    <Line data={priceHistoryData} />
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ShoppingListPage;
