import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardContent, IonLabel, IonItem, IonIcon, IonImg, IonThumbnail, useIonViewWillEnter, IonChip, IonGrid, IonCol, IonRow, IonCardTitle, IonButtons, IonButton } from '@ionic/react';
import ExploreContainer from '../../components/SharedComponents/ExploreContainer';
import './SearchPage.css';
import React, { useState } from 'react';
import { add, remove, arrowForward, arrowBack, syncOutline } from 'ionicons/icons';

const SearchPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<any[]>([]);
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

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
    return products;
  };

  const handleSearch = () => {
    setSearchAttempted(true);

    if (query.length < 3 || query.length > 50) {
      setError('Search query must be between 3 and 50 characters.');
      return;
    }

    setError(''); // Clear the error if the query is valid
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
                      />
                      <IonCardContent>
                        <IonCardTitle className="one-line-title">
                          {product.title}
                        </IonCardTitle>
                        <div className="productDetails">
                          <div>
                            <IonLabel className="brandSize">Brand</IonLabel>
                            <IonLabel className="brandSize">100g</IonLabel>
                          </div>
                          <IonLabel className="priceLabel">$10.00</IonLabel>
                          <div className="quantityControls">
                            <IonButton
                              shape="round"
                              className="controlButton"
                              aria-label="Decrease quantity"
                            >
                              <IonIcon slot="icon-only" icon={remove} />
                            </IonButton>
                            <p className="quantityText">0</p>
                            <IonButton
                              shape="round"
                              className="controlButton"
                              aria-label="Increase quantity"
                            >
                              <IonIcon slot="icon-only" icon={add} />
                            </IonButton>
                          </div>
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

      </IonContent>
    </IonPage>
  );
};

export default SearchPage;
