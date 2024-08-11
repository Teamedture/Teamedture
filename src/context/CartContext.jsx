import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { userContext } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const { token, user } = useContext(userContext);
	const [cartItems, setCartItems] = useState([]);
	const [cartLoading, setCartLoading] = useState(false);

	const fetchCartItems = async () => {
		if (!token || user?.role !== "STUDENT") return;

		setCartLoading(true);

		try {
			const response = await axios.get("https://edture.onrender.com/cart", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (
				response.data &&
				response.data.data &&
				response.data.data.courses
			) {
				setCartItems(response.data.data.courses);
			} else {
				console.error("Unexpected response structure:", response.data);
			}
			setCartLoading(false);
		} catch (error) {
			console.error("Failed to fetch cart items:", error);
			setCartLoading(false);
		}
	};

	useEffect(() => {
		fetchCartItems();
	}, [token]);

	const addItemToCart = async (item) => {
		if (!token) return false;

		setCartLoading(true);

		const itemExists = cartItems.some((cartItem) => cartItem.id === item.id);

		if (itemExists) {
			console.error("Item is already in the cart");
			return false;
		}

		try {
			await axios.post(
				"https://edture.onrender.com/cart",
				{ courseId: item.id },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			await fetchCartItems();

			setCartLoading(false);

			return true;
		} catch (error) {
			console.error("Failed to add item to cart:", error);
			setCartLoading(false);
			return false;
		}
	};

	const removeItemFromCart = async (item) => {
		if (!token) return;

		setCartLoading(true);

		try {
			await axios.delete("https://edture.onrender.com/cart", {
				headers: { Authorization: `Bearer ${token}` },
				data: { courseId: item.id },
			});

			await fetchCartItems();
			setCartLoading(false);
		} catch (error) {
			console.error("Failed to remove item from cart:", error);
			setCartLoading(false);
		}
	};

	const clearCartItems = () => {
		setCartItems([]);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addItemToCart,
				removeItemFromCart,
				clearCartItems,
				cartLoading,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	return useContext(CartContext);
};
