import styled from "styled-components";
import { useCompareList } from "../hooks";
import { CompareItem } from "../utils";
import { format, percentDiff } from "../utils";

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

const CompareRow = ({
  label,
  a,
  b,
}: {
  label: string;
  a: number | undefined;
  b: number | undefined;
}) => {
  const av = a ?? 0;
  const bv = b ?? 0;
  return (
    <tr>
      <td>{label}</td>
      <td>{format(av)}</td>
      <td>{format(bv)}</td>
      <td>{format(Math.abs(av - bv))}</td>
      <td>{format(percentDiff(av, bv))}</td>
    </tr>
  );
};

const CompareCard = (props: { item: CompareItem }) => {
  const { hexA, hexB } = props.item;

  return (
    <StyledCompareCard>
      <table>
        <tr>
          <th style={{ width: "20%" }}></th>
          <th style={{ width: "20%", backgroundColor: `#${hexA.hex}`, color: `#${hexB.hex}` }}>
            {hexA.hex}
          </th>
          <th style={{ width: "20%", backgroundColor: `#${hexB.hex}`, color: `#${hexA.hex}` }}>
            {hexB.hex}
          </th>
          <th style={{ width: "20%" }}>|diff|</th>
          <th style={{ width: "20%" }}>% diff</th>
        </tr>
        <CompareRow label="Red" a={hexA.RGB?.red} b={hexB.RGB?.red} />
        <CompareRow label="Green" a={hexA.RGB?.green} b={hexB.RGB?.green} />
        <CompareRow label="Blue" a={hexA.RGB?.blue} b={hexB.RGB?.blue} />
        <CompareRow label="Hue" a={hexA.HSL?.hue} b={hexB.HSL?.hue} />
        <CompareRow label="Saturation" a={hexA.HSL?.sat} b={hexB.HSL?.sat} />
        <CompareRow label="Lightness" a={hexA.HSL?.lum} b={hexB.HSL?.lum} />
      </table>
    </StyledCompareCard>
  );
};

export default CompareCardList;
