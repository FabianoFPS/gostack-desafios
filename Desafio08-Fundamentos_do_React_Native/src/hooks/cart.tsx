import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const ID_STORAGE = '@GomarketPlace:itens';
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storageProducts = await AsyncStorage.getItem(ID_STORAGE);

      if (storageProducts) {
        setProducts([...JSON.parse(storageProducts)]);
      }
    }

    loadProducts();
  }, []);

  const setItens = useCallback(async () => {
    await AsyncStorage.setItem(ID_STORAGE, JSON.stringify(products));
  }, [products]);

  const incrementQuantity = useCallback(
    (itens: Product[], id: string): Product[] => {
      return itens.map(p =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p,
      );
    },
    [],
  );

  const addToCart = useCallback(
    async product => {
      const productExist = products.find(p => p.id === product.id);
      if (productExist) {
        setProducts(incrementQuantity(products, product.id));
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }
      await setItens();
    },
    [incrementQuantity, products, setItens],
  );

  const increment = useCallback(
    async id => {
      setProducts(incrementQuantity(products, id));
      await setItens();
    },
    [incrementQuantity, products, setItens],
  );

  const decrement = useCallback(
    async id => {
      let newProduct = products.map(p =>
        p.id === id ? { ...p, quantity: p.quantity - 1 } : p,
      );
      newProduct = newProduct.filter(item => item.quantity > 0);
      setProducts(newProduct);
      await setItens();
    },
    [setItens, products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
