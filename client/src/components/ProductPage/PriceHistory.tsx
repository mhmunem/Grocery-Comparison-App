import { IonList, IonItem, IonCol, IonRow, IonButton, IonImg } from '@ionic/react';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { getPriceHistory } from '../../services/InitialSetupService';
import type { PriceHistory, PriceHistoryData } from '../../types/price';

export function PriceHistory({ product }: any) {
  const [dailyPriceHistory, setDailyPriceHistory] = useState<PriceHistory[]>([]);
  const [filteredPriceHistory, setFilteredPriceHistory] = useState<PriceHistory[]>([]);
  const [timeRange, setTimeRange] = useState('4W');

  useEffect(
    () => {
      getPriceHistory(product.products.id, 180).then((p: PriceHistory[]) => {
        const prices = p.map(p => ({
          date: new Date(p.date),
          price: p.price
        }))

        setDailyPriceHistory(prices.reverse());
      })
    },
    []
  );

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
          <IonItem>
            <IonCol size="1">
              <IonImg src={product.chains.image_logo} />
            </IonCol>
            <IonCol size="9">
              {product.stores.name}
            </IonCol>
            <IonCol size="2" className='priceLabel'>
              ${product.store_products.price}
            </IonCol>
          </IonItem>
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
