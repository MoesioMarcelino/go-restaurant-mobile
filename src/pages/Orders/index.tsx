import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Image } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}
interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  thumbnail_url: string;
  quantity: number;
  extras: Extra[];
}

const Orders: React.FC = () => {
  const { navigate } = useNavigation();

  const [orders, setOrders] = useState<Food[]>([]);

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      // Load orders from API
      const { data: foods } = await api.get<Food[]>('orders');

      setOrders(
        foods.map((food: Food) => {
          let totalExtras = 0;

          food.extras.forEach((extra: Extra) => {
            totalExtras += Number(extra.value * extra.quantity);
          });

          return {
            ...food,
            formattedPrice: formatValue(
              (Number(food.price) + totalExtras) * food.quantity,
            ),
          };
        }),
      );
    }

    loadOrders();
  }, []);

  const navigateToOrder = useCallback(
    (id: number) => {
      navigate('Order', { id });
    },
    [navigate],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food
              key={item.id}
              activeOpacity={0.6}
              onPress={() => navigateToOrder(item.id)}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Orders;
