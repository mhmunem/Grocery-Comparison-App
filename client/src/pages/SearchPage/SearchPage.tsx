import './SearchPage.css';
import React, { useEffect, useRef, useState } from 'react';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { IonCol, IonContent, IonGrid, IonHeader, IonImg, IonItem, IonLabel, IonPage, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonToolbar } from '@ionic/react';
import { LoadingContainer } from '../../components/SharedComponents/loadingContainer';
import { PaginationControls } from '../../components/SearchPage/PaginationControls';
import { ProductDetailsModal } from '../../components/ProductPage/ProductDetailsModal';
import { SearchProductCard } from '../../components/SearchPage/SearchProductCard';
import { getPriceHistory, getSearch } from "../../services/InitialSetupService";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


type Product = {
  products: {
    id: number;
    name: string;
    brand: string;
    details: string;
    amount: number;
    image: string;
    unitID: number;
    categoryID: number;
  };
  store_products: {
    id: number; // storeProductId
    storeID: number;
    productID: number;
    price: number;
  };
};

const SearchPage: React.FC = () => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>({});

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  const [sortedAndFilteredProducts, setSortedAndFilteredProducts] = useState<Product[]>([]);
  const [sortValue, setSortValue] = useState('lowest-highest price');

  const sortOptions = [
    { label: 'Alphabetical A-Z', value: 'az' },
    { label: 'Alphabetical Z-A', value: 'za' },
    { label: 'Price (Ascending)', value: 'lowest-highest price' },
    { label: 'Price (Descending)', value: 'highest-lowest price' },
    { label: 'Unit Price (Ascending)', value: 'lowest-highest unit price' },
    { label: 'Unit Price (Descending)', value: 'highest-lowest unit price' },
    { label: 'Volume (Ascending)', value: 'lowest-highest volume' },
    { label: 'Volume (Descending)', value: 'highest-lowest volume' },
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let results: Product[] = await getSearch('', 'name', 'ASC');
        setProducts(results);

        const savedQ = localStorage.getItem('quantities');
        const savedC = localStorage.getItem('addedToCart');

        if (savedQ && savedC) {
          setQuantities(JSON.parse(savedQ));
          setAddedToCart(JSON.parse(savedC));
        } else {
          const initialQuantities = results.reduce(
            (acc: { [key: string]: number }, product: Product) => {
              const storeIdStr = product.store_products.id.toString();
              acc[storeIdStr] = 0;
              return acc;
            },
            {}
          );
          setQuantities(initialQuantities);
          setAddedToCart({});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClearSelection = () => {
    setSelectedCategories([]); // Clear the selected categories
  };
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

  const increaseQuantity = (productId: string | number) => {
    const storeIdStr = productId.toString();
    const newQuantities = { ...quantities };
    newQuantities[storeIdStr] = (newQuantities[storeIdStr] || 0) + 1;

    const newAddedToCart = { ...addedToCart };
    newAddedToCart[storeIdStr] = true;

    setQuantities(newQuantities);
    setAddedToCart(newAddedToCart);
    updateCart(newQuantities, newAddedToCart);
  };

  const decreaseQuantity = (productId: string | number) => {
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
  };

  const handleSearch = async () => {
    setSearchAttempted(true);
    if (query.length === 0) {
      try {
        let results: Product[] = await getSearch('', 'name', 'ASC');
        setProducts(results);
        setError('');
      } catch (error) {
        console.error('Error searching products:', error);
        setError('Failed to search products. Please try again later.');
      }
    } else if (query.length < 3 || query.length > 50) {
      setError('Search query must be between 3 and 50 characters.');
      return;
    } else {
      try {
        let results = await getSearch(query, 'name', 'ASC');
        setProducts(results);
        setError('');
      } catch (error) {
        console.error('Error searching products:', error);
        setError('Failed to search products. Please try again later.');
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };
  const handleBlur = () => {
    handleSearch();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const selectSortOption = (value: string) => {
    setSortValue(value);
    setIsDropdownOpen(false);
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };
  const closeProductDetails = () => {
    setShowProductDetails(false);
  };

  useEffect(() => {
    const total = Math.ceil(sortedAndFilteredProducts.length / itemsPerPage);
    if (currentPage > total && total > 0) {
      setCurrentPage(total);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [sortedAndFilteredProducts, currentPage, itemsPerPage]);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(sortedAndFilteredProducts.length / itemsPerPage)));
  };
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const goToPage = (page: number) => {
    const total = Math.ceil(sortedAndFilteredProducts.length / itemsPerPage);
    if (page >= 1 && page <= total) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1);

    let updatedProducts = [...products];

    if (query) {
      updatedProducts = updatedProducts.filter((p) =>
        p.products.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter((p) =>
        selectedCategories.includes(p.products.categoryID.toString())
      );
    }

    updatedProducts.sort((a, b) => {
      switch (sortValue) {
        case 'lowest-highest price':
          return a.store_products.price - b.store_products.price;
        case 'highest-lowest price':
          return b.store_products.price - a.store_products.price;
        case 'az':
          return a.products.name.localeCompare(b.products.name);
        case 'za':
          return b.products.name.localeCompare(a.products.name);
        default:
          return 0;
      }
    });

    setSortedAndFilteredProducts(updatedProducts);
  }, [products, sortValue, selectedCategories, itemsPerPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const startIndex = (currentPage - 1) * itemsPerPage;

  // console.log("getPriceHistory", (async () => await getPriceHistory(1, 30))()); // NOTE: remove me


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar" color="primary">
          <div className="title-center">
            <IonImg
              src="680logocropped.png"
              alt="App Logo"
              className='headerLogo'
            />
          </div>
          <IonSearchbar
            value={query}
            onIonChange={(e) => setQuery(e.detail.value!)}
            onKeyUp={handleKeyDown}
            onIonBlur={handleBlur}
            placeholder="Search for products..."
            debounce={300}
            disabled={false}
            className="searchbar"
            onIonClear={() => setQuery('')} // Clear the query when the 'x' is clicked
          />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="toolbar-container" >
          <div className="categoryDropdown-container">
            <IonItem>
              <IonSelect
                multiple={true}
                value={selectedCategories}
                onIonChange={(e) => setSelectedCategories(e.detail.value)}
                label="Category"
                labelPlacement="floating"
              >
                <IonSelectOption value="1">Fish</IonSelectOption>
                <IonSelectOption value="2">Meat</IonSelectOption>
                <IonSelectOption value="3">Frozen</IonSelectOption>
                <IonSelectOption value="4">Fruit & Veg</IonSelectOption>
                <IonSelectOption value="5">Bakery</IonSelectOption>
                <IonSelectOption value="6">Deli</IonSelectOption>
                <IonSelectOption value="7">Drinks</IonSelectOption>
                <IonSelectOption value="8">Household</IonSelectOption>
                <IonSelectOption value="9">Health & Body</IonSelectOption>
                <IonSelectOption value="10">Beer & Wine</IonSelectOption>
                <IonSelectOption value="11">Pantry</IonSelectOption>
                <IonSelectOption value="12">Baby & Child</IonSelectOption>
              </IonSelect>
            </IonItem>
            <button type="button" onClick={handleClearSelection} className="categories-clear-button">
              Clear All
            </button>
          </div>
          <div className="spacer"></div>
          <div className="sortDropdown-container" ref={dropdownRef}>
            <button
              type="button"
              className={`sortDropdown-toggle ${isDropdownOpen ? 'open' : ''}`}
              onClick={toggleDropdown}
            >
              <span className="sortDropdown-selectedLabel">
                {sortOptions.find((opt) => opt.value === sortValue)?.label ?? 'Most relevant'}
              </span>
              <span className="sortDropdown-chevron">&#9662;</span>
            </button>
            <div className={`sortDropdown-menu ${isDropdownOpen ? 'open' : ''}`} tabIndex={-1}>
              {sortOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`sortDropdown-item ${opt.value === sortValue ? 'selected' : ''}`}
                  onClick={() => selectSortOption(opt.value)}
                  role="button"
                  tabIndex={0}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>
          <button type="button"
            className="clear-sort-btn"
            onClick={() => setSortValue('lowest-highest price')}
          >Default</button>
        </div>
        {searchAttempted && error && (
          <div className="error-container">
            <IonLabel className="error-message">{error}</IonLabel>
          </div>
        )}
        {loading ? (<LoadingContainer />) : sortedAndFilteredProducts.length === 0 ? (
          // Show "No results found" message if no products are returned
          <div className="no-results-container">
            <IonLabel>No results found</IonLabel>
          </div>
        ) : (
          // Display the grid of products if results exist
          <div className="grid-container">
            <IonGrid>
              <IonRow>
                {sortedAndFilteredProducts.slice(startIndex, startIndex + itemsPerPage).map((product, index) => {
                  return (
                    <IonCol
                      size="6"
                      size-sm="4"
                      size-md="4"
                      size-lg="3"
                      size-xl='3'
                      key={index}
                      class="ion-no-margin"
                    >
                      <SearchProductCard
                        decreaseQuantity={decreaseQuantity}
                        increaseQuantity={increaseQuantity}
                        quantities={quantities}
                        product={product}
                        productID={product.products.id}
                        productBrand={product.products.brand}
                        productDetails={product.products.details}
                        productName={product.products.name}
                        productPrice={product.store_products.price}
                        productImage={product.products.image}
                        openProductDetails={openProductDetails}
                      />
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
          </div>
        )}
        {!loading && products.length > 0 && (<PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(sortedAndFilteredProducts.length / itemsPerPage)}
          nextPage={nextPage}
          prevPage={prevPage}
          goToPage={goToPage}
        />)}
        <ProductDetailsModal
          decreaseQuantity={decreaseQuantity}
          increaseQuantity={increaseQuantity}
          quantities={quantities}
          selectedProduct={selectedProduct}
          showProductDetails={showProductDetails}
          closeProductDetails={closeProductDetails}
        />
      </IonContent>
    </IonPage>
  );
};

export default SearchPage;

