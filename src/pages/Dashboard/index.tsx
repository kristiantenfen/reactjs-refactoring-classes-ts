import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { FoodProps } from '../../types';

const Dashboard = () => {

  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps);

  useEffect(() => {
    getProducts();
  }, [])

  const getProducts = async () => {
    const {data: foods} = await api.get('/foods');
    setFoods(foods);
  }

  const handleAddFood = async (food: FoodProps) => {

    try {
      const {data: {foods}} = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(foods);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodProps) => {

    try {
      const {data} = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      setFoods(foods.map(f =>
        f.id !== data.id ? f : data,
      ));
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);
    setFoods(foods.filter(food => food.id !== id));
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen );
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen );
  }

  const handleEditFood = (food: FoodProps) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};

export default Dashboard;
