import styled from "styled-components";
import { useCompareList } from "../hooks";
import { CompareItem } from "../utils";
import { format, absPercentDiff, populateHexEntry } from "../utils";

// This component is primarily used to determine various calculations
// It is useful but should not be exposed to the user

const StyledCompareCard = styled.div`
  min-width: 20%;
  max-width: 90%;
  border: 2px solid grey;
  border-radius: 10px;
  margin: auto;

  th {
    width: 20%;
  }
`;

const CompareCardList = () => {
  const { items } = useCompareList();

  return (
    <>
      {items.map((item, i) => (
        <CompareCard key={i} item={item} />
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
      <td>{format(absPercentDiff(av, bv))}</td>
    </tr>
  );
};

const CompareCard = ({ item }: { item: CompareItem }) => {
  const { hexA, hexB } = item;

  const hexAFull = populateHexEntry(hexA);
  const hexBFull = populateHexEntry(hexB);

  return (
    <StyledCompareCard>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th
              style={{
                backgroundColor: `#${hexA.hex}`,
                color: `#${hexB.hex}`,
              }}
            >
              {hexA.hex}
            </th>
            <th
              style={{
                backgroundColor: `#${hexB.hex}`,
                color: `#${hexA.hex}`,
              }}
            >
              {hexB.hex}
            </th>
            <th>|diff|</th>
            <th>% diff</th>
          </tr>
          <CompareRow label="Red" a={hexAFull.RGB?.red} b={hexBFull.RGB?.red} />
          <CompareRow
            label="Green"
            a={hexAFull.RGB?.green}
            b={hexBFull.RGB?.green}
          />
          <CompareRow
            label="Blue"
            a={hexAFull.RGB?.blue}
            b={hexBFull.RGB?.blue}
          />
          <CompareRow label="Hue" a={hexAFull.HSL?.hue} b={hexBFull.HSL?.hue} />
          <CompareRow
            label="Saturation"
            a={hexAFull.HSL?.sat}
            b={hexBFull.HSL?.sat}
          />
          <CompareRow
            label="Lightness"
            a={hexAFull.HSL?.lum}
            b={hexBFull.HSL?.lum}
          />
        </tbody>
      </table>
    </StyledCompareCard>
  );
};

export default CompareCardList;
