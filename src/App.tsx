import "./styles.css";
import InputCard from "./components/DisplayCard";

export default function App() {
  return (
    <div className="App">
      <h1>Hex Mirror</h1>
      <h2>Provide a hexcode to find its mirror set.</h2>
      <InputCard />
    </div>
  );
}

// TODO
// - dark mode
// - copy hex - cursor: copy;
// - opacity slider XOR submit button
// - hover state (?) to indicate which mirror hex
// - provide formulas for each calculation
