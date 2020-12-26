import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, RefreshControl } from 'react-native';

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

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

const Favorites: React.FC = () => {
  const navigation = useNavigation();

  const [favorites, setFavorites] = useState<Food[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = useCallback(async () => {
    setRefreshing(true);

    // Load favorite foods from api
    const { data: favoritesReturned } = await api.get<Food[]>('/favorites');

    setFavorites(
      favoritesReturned.map((food: Food) => ({
        ...food,
        formattedPrice: formatValue(food.price),
      })),
    );

    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function handleNavigate(id: number): Promise<void> {
    // Navigate do ProductDetails page
    navigation.navigate('FoodDetails', { id });
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={item => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadFavorites} />
          }
          renderItem={({ item }) => (
            <Food activeOpacity={0.6} onPress={() => handleNavigate(item.id)}>
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

export default Favorites;
