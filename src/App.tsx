import "./styles.css";
import InputCard from "./components/DisplayCard";
import CompareCardList from "./components/CompareCard";

export default function App() {
  return (
    <div className="App">
      <h1>Hex Mirror</h1>
      <h2>Provide a hexcode to find its mirror hex.</h2>
      <InputCard />
      <CompareCardList />
    </div>
  );
}

// TODO
// - dark mode
// - copy hex
// - opacity slider
// - submit button
// - hover state to indicate which mirror hex
