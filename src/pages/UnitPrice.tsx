import { useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonText, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';

interface ProductRow {
  id: number;
  name: string;
  price: string;
  quantity: string;
}

interface ProductResult {
  name: string;
  unitPrice: number;
}

const UnitPrice = () => {
  const [products, setProducts] = useState<ProductRow[]>([
    { id: 1, name: 'Product 1', price: '', quantity: '' },
    { id: 2, name: 'Product 2', price: '', quantity: '' },
    { id: 3, name: 'Product 3', price: '', quantity: '' }
  ]);
  const [sortedResults, setSortedResults] = useState<ProductResult[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  const updateProduct = (id: number, field: 'name' | 'price' | 'quantity', value: string) => {
    setProducts((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const onCalculate = () => {
    const computed: ProductResult[] = [];

    for (const product of products) {
      if (!product.name.trim() || !product.price.trim() || !product.quantity.trim()) {
        setToastMessage('Please fill all product rows');
        return;
      }

      const price = Number(product.price);
      const quantity = Number(product.quantity);

      if (Number.isNaN(price) || Number.isNaN(quantity) || price < 0 || quantity <= 0) {
        setToastMessage('Price must be non-negative and quantity must be greater than zero');
        return;
      }

      computed.push({
        name: product.name,
        unitPrice: price / quantity
      });
    }

    computed.sort((a, b) => a.unitPrice - b.unitPrice);
    setSortedResults(computed);
  };

  return (
    <CalculatorLayout title="Unit Price Comparator">
      {products.map((product, index) => (
        <IonCard key={product.id}>
          <IonCardContent>
            <IonText>
              <h3 className="section-heading">Product {index + 1}</h3>
            </IonText>
            <InputField
              label="Name"
              value={product.name}
              onChange={(value) => updateProduct(product.id, 'name', value)}
              type="text"
              inputMode="text"
            />
            <InputField
              label="Price"
              value={product.price}
              onChange={(value) => updateProduct(product.id, 'price', value)}
              type="number"
              inputMode="decimal"
            />
            <InputField
              label="Quantity"
              value={product.quantity}
              onChange={(value) => updateProduct(product.id, 'quantity', value)}
              type="number"
              inputMode="decimal"
            />
          </IonCardContent>
        </IonCard>
      ))}

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {sortedResults.length > 0 ? (
        <IonCard>
          <IonCardContent>
            <IonText>
              <h3 className="section-heading">Sorted Unit Price (Lowest First)</h3>
            </IonText>
            {sortedResults.map((result, index) => (
              <IonItem key={`${result.name}-${index}`}>
                <IonLabel color={index === 0 ? 'success' : undefined}>
                  <h3>{result.name}</h3>
                  <p>{result.unitPrice.toFixed(4)} per unit</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonCardContent>
        </IonCard>
      ) : null}

      <IonToast
        isOpen={Boolean(toastMessage)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color="danger"
        onDidDismiss={() => setToastMessage('')}
      />
    </CalculatorLayout>
  );
};

export default UnitPrice;
