import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const temp_items = JSON.parse(localStorage.getItem("items"));
    console.log(temp_items);
    if (temp_items?.length) setItems(temp_items);
  }, []);

  useEffect(() => {
    if (items?.length) localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  function handleAddItems(item) {
    setItems((items) => [item, ...items]);
  }
  function deleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function clearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items."
    );
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItems} />
      <PackingList
        items={items}
        deleteItem={deleteItem}
        onPackedItem={handleToggleItem}
        onClearList={clearList}
      />
      <Stats items={items} />
    </div>
  );
}

// Logo for the application
function Logo() {
  return <h1>🌴 Far Away 💼</h1>;
}

// Form handling to add items in a list
function Form({ onAddItem }) {
  const [desc, setDesc] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!desc.trim() || quantity === 0) return;
    const newItem = {
      description: desc,
      quantity: quantity,
      packed: false,
      id: Date.now(),
    };

    onAddItem(newItem);
    setDesc("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip</h3>
      <select value={quantity} onChange={(e) => setQuantity(+e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        placeholder="Item..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      ></input>
      <button>Add</button>
    </form>
  );
}

// Packing list handling

function PackingList({ items, deleteItem, onPackedItem, onClearList }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "desc")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items.slice().sort((a, b) => Number(a.packed - b.packed));
  return (
    <div className="list">
      <div className="sub-list">
        <ul>
          {sortedItems.map((item) => (
            <Item
              item={item}
              key={item.id}
              deleteItem={deleteItem}
              onPackedItem={onPackedItem}
            />
          ))}
        </ul>
      </div>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input</option>
          <option value="desc">Sort by description</option>
          <option value="packed">Sort by packed</option>
        </select>
        <button onClick={onClearList}>Clear list</button>
      </div>
    </div>
  );
}

// renderting item to be add in packing list

function Item({ item, deleteItem, onPackedItem }) {
  return (
    <li key={item.id}>
      <input type="checkbox" onChange={() => onPackedItem(item.id)} />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => deleteItem(item.id)}>❌</button>
    </li>
  );
}

// Details of Packed items in footer area
function Stats({ items }) {
  if (!items.length)
    return (
      <footer className="stats">
        <em>Please add some Items first 🚀</em>
      </footer>
    );
  const numItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentItem = Math.trunc((packedItems / numItems) * 100);
  return (
    <footer className="stats">
      <em>
        {packedItems === 100
          ? "You are done Ready to go ✈"
          : `💼 You have${numItems} items to pack but packed only ${packedItems} ($
          ${percentItem}%)`}
      </em>
    </footer>
  );
}
