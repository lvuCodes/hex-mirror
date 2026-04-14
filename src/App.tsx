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

// Average Absolute Diff - Google Sheets dark vs light
//              737373    757171    |diff|    % diff
// Red          115       117         2       0.0172
// Green        115       113         2       0.0175
// Blue         115       113         2       0.0175
// Hue          0         0.8802    0.8802    2
// Saturation   0         0.0200    0.0200    2
// Lightness    0.4509    0.4511    0.0001    0.0003
