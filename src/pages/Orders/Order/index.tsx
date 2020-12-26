import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Image } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import formatValue from '../../../utils/formatValue';

import api from '../../../services/api';

import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AmountFood,
  AmountFoodText,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdittionalItem,
  AdittionalItemText,
  AdittionalQuantity,
  PriceButtonContainer,
  TotalPrice,
  FinishOrderButton,
  ButtonText,
  IconContainer,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Order {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  formattedPrice: string;
  extras: Extra[];
  quantity: number;
}

const Order: React.FC = () => {
  const [order, setOrder] = useState({} as Order);
  const [extras, setExtras] = useState<Extra[]>([]);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadOrder(): Promise<void> {
      // Load a specific food with extras based on routeParams id
      const { data: orderReturned } = await api.get<Order>(
        `/orders/${routeParams.id}`,
      );

      setOrder({
        ...orderReturned,
        formattedPrice: formatValue(orderReturned.price),
      });

      setExtras(orderReturned.extras);
    }

    loadOrder();
  }, [routeParams]);

  const cartTotal = useMemo(() => {
    // Calculate cartTotal
    let totalExtras = 0;

    extras.forEach((extra: Extra) => {
      totalExtras += Number(extra.value * extra.quantity);
    });

    return formatValue((Number(order.price) + totalExtras) * order.quantity);
  }, [extras, order]);

  const handleCancelOrder = useCallback(async () => {
    await api.delete(`orders/${routeParams.id}`);

    navigation.reset({
      routes: [{ name: 'Orders' }],
      index: 0,
    });

    navigation.navigate('Orders');
  }, [navigation, routeParams.id]);

  return (
    <Container>
      <Header />

      <ScrollContainer>
        <FoodsContainer>
          <Food>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: order.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{order.name}</FoodTitle>
              <FoodDescription>{order.description}</FoodDescription>
              <FoodPricing>{order.formattedPrice}</FoodPricing>
              <AmountFood>
                <AmountFoodText>{order.quantity}</AmountFoodText>
              </AmountFood>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdittionalItem key={extra.id}>
              <AdittionalItemText>{extra.name}</AdittionalItemText>
              <AdittionalQuantity>
                <AdittionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdittionalItemText>
              </AdittionalQuantity>
            </AdittionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice testID="cart-total">{cartTotal}</TotalPrice>
          </PriceButtonContainer>
        </TotalContainer>

        <FinishOrderButton onPress={handleCancelOrder}>
          <ButtonText>Cancelar pedido</ButtonText>
          <IconContainer>
            <Icon name="trash-2" size={24} color="#fff" />
          </IconContainer>
        </FinishOrderButton>
      </ScrollContainer>
    </Container>
  );
};

export default Order;
