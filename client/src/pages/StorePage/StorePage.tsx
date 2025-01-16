import React, { useEffect, useState } from 'react';
import { star, storefront, storefrontOutline } from 'ionicons/icons';
import './StorePage.css';
import { getChains, getStores } from '../../services/StoreService';
import { IonImg, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonList, IonItem, IonCheckbox, IonLabel, IonTabBar, IonTabButton } from '@ionic/react';

const StorePage: React.FC = () => {
    const [chains, setChains] = useState<Chain[]>([]);
    const [stores, setStores] = useState<Stores[]>([]);
    const [selectedChainId, setSelectedChainId] = useState<number | string>('favorites');
    const [selectedStores, setSelectedStores] = useState<number[]>([]);

    useEffect(() => {
        getChains()
            .then(response => response.json())
            .then(data => setChains(data))
            .catch(error => console.error('Error fetching chain data:', error));

        getStores()
            .then(response => response.json())
            .then(data => setStores(data))
            .catch(error => console.error('Error fetching store data:', error));
    }, []);

    const selectChain = (chainId: number | string) => {
        setSelectedChainId(chainId);
    };

    const selectStores = (storeId: number) => {
        if (selectedStores.includes(storeId)) {
            setSelectedStores(selectedStores.filter(id => id !== storeId));
        } else {
            setSelectedStores([...selectedStores, storeId]);
        }
    };

    const deselectStores = (chainId: number | string) => {
        if (chainId === 'favorites') {
            setSelectedStores([]);
        } else {
            setSelectedStores(selectedStores.filter(storeId => {
                const store = stores.find(store => store.id === storeId);
                return store?.chainID !== chainId;
            }));
        }
    };

    const filteredStores = selectedChainId === 'favorites'
        ? stores.filter(store => selectedStores.includes(store.id))
        : stores.filter(store => store.chainID === selectedChainId);

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
                        <IonTitle slot="end" > Store Selector</IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonTabBar>
                    <IonTabButton tab="favorites" onClick={() => selectChain('favorites')}>
                        <IonIcon aria-hidden="true" icon={star} color="primary" />
                        <IonLabel>Favorites</IonLabel>
                    </IonTabButton>

                    {chains.map(chain => (
                        <IonTabButton key={chain.id} tab={chain.name} onClick={() => selectChain(chain.id)}>
                            <img src={chain.image_logo} alt={chain.name} style={{ width: '24px', height: '24px' }} />
                            <IonLabel>{chain.name}</IonLabel>
                        </IonTabButton>
                    ))}
                </IonTabBar>


                {selectedChainId === 'favorites' ? (
                    <div className="centered-text">
                        {filteredStores.length === 0 ? (
                            <><IonIcon className="store-icon" icon={storefrontOutline} /><h2>Choose Stores</h2><p>Tap the tabs above to select your preferred stores. You can choose up to 20 stores.</p></>
                        ) : (
                            <div><IonButton expand="block" onClick={() => deselectStores('favorites')}>Deselect all stores under this tab</IonButton>
                                <IonList>
                                    {filteredStores.map(store => (
                                        <IonItem key={store.id} onClick={() => selectStores(store.id)}>
                                            <IonCheckbox
                                                checked={selectedStores.includes(store.id)} />
                                            <IonLabel>{store.name}</IonLabel>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <IonButton expand="block" onClick={() => deselectStores(selectedChainId)}>Deselect all stores under this tab</IonButton>
                        <IonList>
                            {stores.filter(store => store.chainID === selectedChainId).map(store => (
                                <IonItem onClick={() => selectStores(store.id)} key={store.id}>
                                    <IonCheckbox disabled={selectedStores.length >= 20 && !selectedStores.includes(store.id)}
                                        checked={selectedStores.includes(store.id)}
                                    />
                                    <IonLabel>{store.name}</IonLabel>
                                </IonItem>
                            ))}
                        </IonList>

                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default StorePage;
