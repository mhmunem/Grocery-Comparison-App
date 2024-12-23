import { IonContent, IonHeader, IonPage, IonList, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonModal, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';
import ExploreContainer from '../../components/SharedComponents/ExploreContainer';
import './SearchPage.css';
import React, { useState, useEffect } from 'react';
import { add, remove, arrowForward, arrowBack, syncOutline } from 'ionicons/icons';
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
import { Line } from 'react-chartjs-2';

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

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const [dailyPriceHistory, setDailyPriceHistory] = useState<PriceHistory[]>([]);
  const [filteredPriceHistory, setFilteredPriceHistory] = useState<PriceHistory[]>([]);
  const [timeRange, setTimeRange] = useState('3M');


  useIonViewWillEnter(async () => {
    setLoading(true);
    try {
      const products = await getData();
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  });

  const getData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos?albumId=2');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();

    const initialQuantities = products.reduce((acc: { [key: string]: number }, product: any) => {
      acc[product.id] = 0;
      return acc;
    }, {});

    setQuantities(initialQuantities);
    return products;
  };

  const handleSearch = () => {
    setSearchAttempted(true);

    if (query.length < 3 || query.length > 50) {
      setError('Search query must be between 3 and 50 characters.');
      return;
    }

    setError('');
    console.log('Performing search for:', query);
    // Perform search logic here
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBlur = () => {
    handleSearch();
  };


  const openProductDetails = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const closeProductDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };



  const handleAddToCart = (productId: string) => {
    setAddedToCart((prevAddedToCart) => ({
      ...prevAddedToCart,
      [productId]: true
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setAddedToCart((prevAddedToCart) => ({
      ...prevAddedToCart,
      [productId]: false,
    }));
  };

  const increaseQuantity = (productId: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));
  };

  const decreaseQuantity = (productId: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(prevQuantities[productId] - 1, 0),
    }));
  };

  useEffect(() => {
    const generateDummyData = () => {
      const today = new Date();
      const prices: PriceHistory[] = [];
      for (let i = 0; i < 365; i++) {
        const randomPrice = 10 + Math.random() * 5;
        prices.push({ date: new Date(today.setDate(today.getDate() - 1)), price: randomPrice });
      }
      setDailyPriceHistory(prices.reverse());
    };
    generateDummyData();
  }, []);

  useEffect(() => {
    const filterDataByRange = () => {
      const today = new Date();
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

  const priceHistoryData: PriceHistoryData = {
    labels: filteredPriceHistory.map((entry) =>
      entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Price History',
        data: filteredPriceHistory.map((entry) => entry.price),
        borderColor: '#7371FC',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4,
      },
    ],
  };





  return (
    <IonPage>
      <IonHeader>

        <IonToolbar color="primary">
          <IonSearchbar
            value={query}
            onIonChange={(e) => setQuery(e.detail.value!)}
            onKeyDown={handleKeyDown}
            onIonBlur={handleBlur}
            placeholder="Search for products..."
            debounce={300}
            className="searchbar" />
        </IonToolbar>

      </IonHeader>

      <IonContent>
        {searchAttempted && error && (
          <div className="error-container">
            <IonLabel className="error-message">{error}</IonLabel>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <IonIcon className="loading-spinner" icon={syncOutline} />
            <IonLabel className="loading-message">Fetching results...</IonLabel>
          </div>
        ) : products.length === 0 ? (
          // Show "No results found" message if no products are returned
          <div className="no-results-container">
            <IonLabel>No results found</IonLabel>
          </div>
        ) : (
          // Display the grid of products if results exist
          <div className="grid-container">
            <IonGrid>
              <IonRow>
                {products.map((product, index) => (
                  <IonCol
                    size="6"
                    size-sm="4"
                    size-md="4"
                    size-lg="3"
                    key={index}
                    class="ion-no-margin"
                  >
                    <IonCard className="listCard">
                      <IonImg
                        src={product.thumbnailUrl}
                        alt={product.title}
                        className="productImage"
                        onClick={() => openProductDetails(product)} />

                      <IonCardContent>

                        <IonCardTitle className="one-line-title" onClick={() => openProductDetails(product)}>
                          {product.title}
                        </IonCardTitle>

                        <div className="productDetails">

                          <div>
                            <IonLabel className="brandSize">Brand</IonLabel>
                            <IonLabel className="brandSize">100g</IonLabel>
                          </div>

                          <IonLabel className="priceLabel">$10.00</IonLabel>
                          {addedToCart[product.id] ? (
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
                          ) : (
                            <IonButton onClick={() => handleAddToCart(product.id)} className="controlButton">
                              Add to Cart
                            </IonButton>

                          )}

                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="pagination">

            <IonButton shape="round" className="controlButton">
              <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
            </IonButton>

            <span>Page 1 of 5</span>

            <IonButton shape="round" className="controlButton">
              <IonIcon slot="icon-only" icon={arrowForward}></IonIcon>
            </IonButton>

          </div>
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
                  <div className="productDetails">

                    <div>
                      <IonLabel className="brandSize">Brand</IonLabel>
                      <IonLabel className="brandSize">100g</IonLabel>
                    </div>

                    <IonLabel className="priceLabel">$10.00</IonLabel>

                    {addedToCart[selectedProduct.id] ? (
                      <div className="quantityControls">
                        <IonButton
                          shape="round"
                          className="controlButton"
                          aria-label="Decrease quantity"
                          onClick={() => decreaseQuantity(selectedProduct.id)}
                          disabled={quantities[selectedProduct.id] === 0} // Disable if quantity is 0
                        >
                          <IonIcon slot="icon-only" icon={remove} />
                        </IonButton>

                        <p className="quantityText">{quantities[selectedProduct.id]}</p>

                        <IonButton
                          shape="round"
                          className="controlButton"
                          aria-label="Increase quantity"
                          onClick={() => increaseQuantity(selectedProduct.id)}
                        >
                          <IonIcon slot="icon-only" icon={add} />
                        </IonButton>
                      </div>
                    ) : (
                      <IonButton onClick={() => handleAddToCart(selectedProduct.id)} className="controlButton">
                        Add to Cart
                      </IonButton>

                    )}
                  </div>
                </IonRow>
                <IonRow>
                  <Line data={priceHistoryData} />

                </IonRow>
                <IonRow style={{ justifyContent: 'center', marginBottom: '16px' }}>
                  {['1M', '3M', '6M', '12M'].map(range => (
                    <IonButton
                      key={range}
                      color={timeRange === range ? 'primary' : 'medium'}
                      onClick={() => setTimeRange(range)}>
                      {range}
                    </IonButton>
                  ))}
                </IonRow>
                <IonRow>
                  <IonList style={{ width: '100%' }}>
                    {products.map((product, index) => (
                      <IonItem>
                        <IonCol size="11">
                          {product.title}

                        </IonCol>
                        <IonCol size="1">
                          ${index}
                        </IonCol>
                      </IonItem>
                    ))}
                  </IonList>
                </IonRow>

                <IonLabel >
                  <h1>Description</h1>
                  <p>Paragraph Paragraph Paragraph Paragraph ParagraphParagraph Paragraph Paragraph Paragraph Paragraph</p>
                </IonLabel>

              </div>
            ) : (
              <p>Loading...</p>
            )}
          </IonContent>

        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default SearchPage;
