import "./styles.css";
import Input from "./components/Input";

export default function App() {
  return (
    <div className="App">
      <h1>Hex Mirror</h1>
      <h2>Provide a hexcode to find its mirror hex.</h2>
      <Input />
    </div>
  );
}
