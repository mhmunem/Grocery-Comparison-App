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

  // -----------------------------
  // 以下是为了实现与SearchPage里
  // "价格历史 + 时间范围" 同样的效果
  // -----------------------------

  // 保存过去一年的假数据（365天），然后根据 timeRange 做筛选
  const [dailyPriceHistory, setDailyPriceHistory] = useState<PriceHistory[]>([]);
  const [filteredPriceHistory, setFilteredPriceHistory] = useState<PriceHistory[]>([]);
  const [timeRange, setTimeRange] = useState('3M'); // 默认显示3个月

  // 最终要给 <Line data={priceHistoryData} /> 的数据
  const [priceHistoryData, setPriceHistoryData] = useState<PriceHistoryData>({
    labels: [],
    datasets: [],
  });

  // -----------------------------
  // 详情弹窗相关 state
  // -----------------------------
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

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

  // -----------------------------
  // 生成一年(365天)的假价格数据
  // -----------------------------
  useEffect(() => {
    const generateDummyData = () => {
      const today = new Date();
      const prices: PriceHistory[] = [];
      for (let i = 0; i < 365; i++) {
        const randomPrice = 10 + Math.random() * 5; // 10 ~ 15之间波动
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        prices.push({ date, price: parseFloat(randomPrice.toFixed(2)) });
      }
      // 逆序一下，让最早日期在前
      prices.reverse();
      setDailyPriceHistory(prices);
    };
    generateDummyData();
  }, []);

  // 每次 timeRange 或 dailyPriceHistory 改变，都要筛选出对应区间的数据
  useEffect(() => {
    const filterDataByRange = () => {
      // 让 timeRange => 对应天数
      const ranges: Record<string, number> = {
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '12M': 365,
      };
      const days = ranges[timeRange] || 365;
      // 取最后 days 条
      const filtered = dailyPriceHistory.slice(-days);
      setFilteredPriceHistory(filtered);
    };
    filterDataByRange();
  }, [timeRange, dailyPriceHistory]);

  // 把筛选后的 filteredPriceHistory 转成 chart.js 所需的格式
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

  // 点击图片 => 打开详情弹窗
  const openProductDetails = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  // 关闭详情弹窗
  const closeProductDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  /**
   * 更新购物车中的商品数量
   */
  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      const newCartItems = prevItems.map((item) =>
        item.product.id.toString() === productId
          ? { ...item, quantity }
          : item
      );

      // 同步 localStorage
      const storedQuantities = localStorage.getItem('quantities');
      const quantitiesParsed = storedQuantities ? JSON.parse(storedQuantities) : {};

      if (quantity > 0) {
        quantitiesParsed[productId] = quantity;
      } else {
        // 数量变为0时，移除该商品
        delete quantitiesParsed[productId];
        const storedAddedToCart = localStorage.getItem('addedToCart');
        const addedToCartParsed = storedAddedToCart ? JSON.parse(storedAddedToCart) : {};
        delete addedToCartParsed[productId];
        localStorage.setItem('addedToCart', JSON.stringify(addedToCartParsed));
      }
      localStorage.setItem('quantities', JSON.stringify(quantitiesParsed));

      // 重新计算 totalPrice
      const newTotal = newCartItems.reduce((sum, item) => sum + item.quantity * 10, 0);
      setTotalPrice(newTotal);

      return newCartItems;
    });
  };

  /**
   * 从购物车移除商品
   */
  const removeItem = (productId: string) => {
    setCartItems((prevItems) => {
      // 去掉某商品
      const newCartItems = prevItems.filter((item) => item.product.id.toString() !== productId);

      // 同步 localStorage
      const storedAddedToCart = localStorage.getItem('addedToCart');
      const addedToCartParsed = storedAddedToCart ? JSON.parse(storedAddedToCart) : {};
      delete addedToCartParsed[productId];
      localStorage.setItem('addedToCart', JSON.stringify(addedToCartParsed));

      const storedQuantities = localStorage.getItem('quantities');
      const quantitiesParsed = storedQuantities ? JSON.parse(storedQuantities) : {};
      delete quantitiesParsed[productId];
      localStorage.setItem('quantities', JSON.stringify(quantitiesParsed));

      // 重新计算价格
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
                      {/* 点击图片 => openProductDetails */}
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
                            onClick={() =>
                              updateQuantity(item.product.id.toString(), item.quantity - 1)
                            }
                            disabled={item.quantity === 1}
                          >
                            <IonIcon slot="icon-only" icon={remove} />
                          </IonButton>
                          <p className="quantityText">{item.quantity}</p>
                          <IonButton
                            shape="round"
                            className="controlButton"
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateQuantity(item.product.id.toString(), item.quantity + 1)
                            }
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
                    {/* <IonButton
                      expand="block"
                      color="primary"
                      //onClick={() => alert('Proceeding to checkout...')}
                    >
                      Proceed to Checkout
                    </IonButton> */}
                  </IonCardContent>
                </IonCard>

                {/* 这里依旧保留一个示例图表 */}
                {/* <IonCard>
                  <IonCardContent>
                    <Line data={priceHistoryData} />
                  </IonCardContent>
                </IonCard> */}
              </IonCol>
            </IonRow>
          </IonGrid>
        )}

        {/* 商品详情弹窗（模态框） => 与 SearchPage 相同的UI结构 */}
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
                {/* 与SearchPage里商品详情部分相同的结构 */}
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
                    {/* 若想在详情弹窗里也能增减，可以参考 SearchPage 的写法:
                        但这里给个简单Add按钮演示 */}
                    {/* <IonButton style={{ marginTop: '8px' }} onClick={() => alert('Add to cart logic')}>
                      Add To Cart
                    </IonButton> */}
                  </div>
                </IonRow>

                <IonRow>
                  {/* 与SearchPage一样的价格折线图 */}
                  <Line data={priceHistoryData} />
                </IonRow>

                {/* 时间范围按钮组 => 1M, 3M, 6M, 12M */}
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
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
