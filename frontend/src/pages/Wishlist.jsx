import { useEffect, useState } from "react";
import axios from "axios";

function Wishlist() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/wishlist/1"
    );

    setItems(res.data);
  };

  const removeItem = async (id) => {

  try {

    await axios.delete(
      `http://localhost:5000/api/wishlist/remove/${id}`
    );

    alert("Removed from wishlist");

    fetchWishlist();

  } catch (error) {

    console.log(error);
    alert("Failed to remove item");

  }

};

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Wishlist ❤️</h1>

      {items.length === 0 && (
        <p>No items in wishlist</p>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginTop: "10px",
            borderRadius: "5px"
          }}
        >
          <h3>{item.product_name}</h3>
          <p>₹{item.price}</p>
          <p>{item.shop_name}</p>

          <button
            onClick={() => removeItem(item.id)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 12px",
              marginTop: "10px",
              cursor: "pointer"
            }}
          >
            Remove
          </button>

        </div>
      ))}
    </div>
  );
}

export default Wishlist;