import './SearchPage.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { IonContent, IonHeader, IonPage, IonToolbar, IonSearchbar, IonLabel, IonImg, IonGrid, IonCol, IonRow } from '@ionic/react';
import { LoadingContainer } from '../../components/SharedComponents/loadingContainer';
import { PaginationControls } from '../../components/SearchPage/PaginationControls';
import { ProductDetailsModal } from '../../components/ProductPage/ProductDetailsModal';
import { SearchProductCard } from '../../components/SearchPage/SearchProductCard';
import { getSearch } from "../../services/InitialSetupService"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

const SearchPage: React.FC = () => {
  
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>({});

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showProductDetails, setShowProductDetails] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortValue, setSortValue] = useState('relevance');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 20;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const sortOptions = [
        { label: 'Name A to Z', value: 'a' },
        { label: 'Name Z to A', value: 'b' },
        { label: 'Price Low to High', value: 'c' },
        { label: 'Price High to Low', value: 'd' },
        { label: 'Amount Low to High', value: 'e' },
        { label: 'Amount High to Low', value: 'f' },
        // { label: 'Most relevant', value: 'relevance' },
        // { label: 'Most recent', value: 'recent' },
        // { label: 'Alphabetical A-Z', value: 'az' },
        // { label: 'Alphabetical Z-A', value: 'za' },
        // { label: 'discounts L-H', value: 'a' },
        // { label: 'discounts H-L', value: 'high to low' },
        // { label: 'popularity L-H', value: 'b' },
        // { label: 'popularity H-L', value: 'high to low' },
        // { label: 'distance L-H', value: 'c' },
        // { label: 'distance H-L', value: 'high to low' },
        // { label: 'weight or volume L-H', value: 'low to high' },
        // { label: 'weight or volume H-L', value: 'high to low' },
        // { label: 'Lowest to highest unit price', value: 'lowest-highest' },
        // { label: 'Highest to lowest unit price', value: 'highest-lowest' },
    ];

    const dropdownRef = useRef<HTMLDivElement>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let results = await getSearch("", "name", "ASC")
                setProducts(results);

                const initialQuantities = products.reduce((acc: { [key: string]: number }, product: any) => {
                    acc[product.id] = 0;
                    return acc;
                }, {});

                setQuantities(initialQuantities);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsDropdownOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleSearch = async () => {
        setSearchAttempted(true);
        if (query.length < 3 || query.length > 50) {
            // BUG: it always gives this error on the first search
            setError('Search query must be between 3 and 50 characters.');
            return;
        }

        let results = await getSearch(query, "name", "ASC").then(re => re)
        setProducts(results);
        console.log(products);

        console.log("getSearch call api:", results);
        setError('');
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
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
        console.log('You selected sort:', value);
        // TODO: implement sort logic here
        // if (value === 'recent') {...}
        // if (value === 'az') {...}
        // if (value === 'za') {...}
        // etc.
    };

    const openProductDetails = (product: any) => {
        setSelectedProduct(product);
        setShowProductDetails(true);
    };

    const closeProductDetails = () => {
        setShowProductDetails(false);
        setSelectedProduct(null);
    };


    const increaseQuantity = (productId: string) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 0) + 1,
        }));
    };
    
    const decreaseQuantity = (productId: string) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Math.max((prevQuantities[productId] || 0) - 1, 0),
        }));
    };

    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonImg
                        src="680logocropped.png"
                        alt="App Logo"
                        className="headerLogo"
                        slot="start"
                    />
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
                    <div
                        className={`sortDropdown-menu ${isDropdownOpen ? 'open' : ''}`}
                        tabIndex={-1}
                    >
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

                {searchAttempted && error && (
                    <div className="error-container">
                        <IonLabel className="error-message">{error}</IonLabel>
                    </div>
                )}

                {loading ? (<LoadingContainer />) : products.length === 0 ? (
                    // Show "No results found" message if no products are returned
                    <div className="no-results-container">
                        <IonLabel>No results found</IonLabel>
                    </div>
                ) : (
                    // Display the grid of products if results exist
                    <div className="grid-container">
                        <IonGrid>
                            <IonRow>
                                {paginatedProducts.map((product, index) => (
                                    <IonCol
                                        size="6"
                                        size-sm="4"
                                        size-md="4"
                                        size-lg="3"
                                        key={index}
                                        class="ion-no-margin"
                                    >
                                        <SearchProductCard
                                            decreaseQuantity={decreaseQuantity}
                                            increaseQuantity={increaseQuantity}
                                            quantities={quantities}
                                            product={product}
                                            openProductDetails={openProductDetails}
                                        />
                                    </IonCol>
                                ))}
                            </IonRow>
                        </IonGrid>
                    </div>
                )}

                {!loading && products.length > 0 && (<PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
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
