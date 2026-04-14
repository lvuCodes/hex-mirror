import styled from "styled-components";
import { useCompareList } from "../hooks";
import { CompareItem } from "../utils";

const StyledCompareCard = styled.div`
  min-width: 20%;
  max-width: 90%;
  border: 2px solid grey;
  border-radius: 10px;
  margin: auto;
`;

const CompareCardList = () => {
  const { items } = useCompareList();

  return (
    <>
      {items.map((item) => (
        <CompareCard item={item} />
      ))}
    </>
  );
};

const CompareCard = (props: { item: CompareItem }) => {
  const { hexA, hexB } = props.item;

  return (
    <StyledCompareCard>
      <table>
        <tr>
          <th style={{ width: "25%" }}></th>
          <th
            style={{
              width: "25%",
              backgroundColor: `#${hexA.hex}`,
              color: `#${hexB.hex}`,
            }}
          >
            {hexA.hex}
          </th>
          <th
            style={{
              width: "25%",
              backgroundColor: `#${hexB.hex}`,
              color: `#${hexA.hex}`,
            }}
          >
            {hexB.hex}
          </th>
          <th style={{ width: "25%" }}>|diff|</th>
        </tr>
        <tr>
          <td>Red</td>
          <td>{hexA.RGB?.red}</td>
          <td>{hexB.RGB?.red}</td>
          <td>{Math.abs((hexA.RGB?.red || 0) - (hexB.RGB?.red || 0))}</td>
        </tr>
        <tr>
          <td>Green</td>
          <td>{hexA.RGB?.green}</td>
          <td>{hexB.RGB?.green}</td>
          <td>{Math.abs((hexA.RGB?.green || 0) - (hexB.RGB?.green || 0))}</td>
        </tr>
        <tr>
          <td>Blue</td>
          <td>{hexA.RGB?.blue}</td>
          <td>{hexB.RGB?.blue}</td>
          <td>{Math.abs((hexA.RGB?.blue || 0) - (hexB.RGB?.blue || 0))}</td>
        </tr>
        <tr>
          <td>Hue</td>
          <td>{String(hexA.HSL?.hue).slice(0, 6)}</td>
          <td>{String(hexB.HSL?.hue).slice(0, 6)}</td>
          <td>
            {String(
              Math.abs((hexA.HSL?.hue || 0) - (hexB.HSL?.hue || 0))
            ).slice(0, 6)}
          </td>
        </tr>
        <tr>
          <td>Saturation</td>
          <td>{String(hexA.HSL?.sat).slice(0, 6)}</td>
          <td>{String(hexB.HSL?.sat).slice(0, 6)}</td>
          <td>
            {String(
              Math.abs((hexA.HSL?.sat || 0) - (hexB.HSL?.sat || 0))
            ).slice(0, 6)}
          </td>
        </tr>
        <tr>
          <td>Lightness</td>
          <td>{String(hexA.HSL?.lum).slice(0, 6)}</td>
          <td>{String(hexB.HSL?.lum).slice(0, 6)}</td>
          <td>
            {String(
              Math.abs((hexA.HSL?.lum || 0) - (hexB.HSL?.lum || 0))
            ).slice(0, 6)}
          </td>
        </tr>
      </table>
    </StyledCompareCard>
  );
};

export default CompareCardList;
