import { IonList, IonItem, IonCol, IonRow, IonButton, IonImg } from '@ionic/react';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Product } from '../../types/product';

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



export function PriceHistory({ product, allPrices }: any) {
    const [dailyPriceHistory, setDailyPriceHistory] = useState<PriceHistory[]>([]);
    const [filteredPriceHistory, setFilteredPriceHistory] = useState<PriceHistory[]>([]);
    const [timeRange, setTimeRange] = useState('4W');


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
            const ranges: Record<string, number> = {
                '1W': 7,
                '4W': 28,
                '3M': 90,
                '6M': 180,
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
        <div>
            <IonRow>
                <IonList style={{ width: '100%' }}>
                    {/* All available stores */}
                    <h4>Pricing Information</h4>
                    {allPrices
                        .sort((a: Product, b: Product) => a.store_products.price - b.store_products.price)
                        .map((store: Product, index: number) => (
                            <IonItem key={index}>
                                <IonCol size="1">
                                    <IonImg src={store.chains.image_logo} />
                                </IonCol>
                                <IonCol size="9">
                                    {store.stores.name}
                                </IonCol>
                                <IonCol size="2" className='priceLabel'>
                                    ${store.store_products.price.toFixed(2)}
                                </IonCol>
                            </IonItem>
                        ))}

                </IonList>

            </IonRow>
            <IonRow>
                <Line data={priceHistoryData} />
            </IonRow>
            <IonRow style={{ justifyContent: 'center', marginBottom: '16px' }}>
                {['1W', '4W', '3M', '6M'].map(range => (
                    <IonButton
                        key={range}
                        color={timeRange === range ? 'primary' : 'medium'}
                        onClick={() => setTimeRange(range)}>
                        {range}
                    </IonButton>
                ))}
            </IonRow>

        </div>
    )
}
