import * as React from 'react';
import { IBookingData } from '../types';
import { Block } from '../containers';
import Button from './common/Button';
import Body from './common/Body';

type Props = {
  goToIntro: () => void;
  goToFloor?: () => void;
  booking: IBookingData | null;
};

function Booking({ goToIntro, booking }: Props) {
  if (!booking) {
    return null;
  }

  const {
    name,
    description,
    childCategories,
    mainProductCategory,
    style
  } = booking;
  const { attachment } = mainProductCategory;
  const { widgetColor, line, columns, rows, margin } = style;

  style.columns = "3";
  style.margin = "10px";
  const blockCount = childCategories.length;
  const column: string = columns!
  const colCount = parseInt(column) >= 4 ? "4" : columns;


  const blocksStyle = {
    width: "100%",
    display: "grid",
    marginTop: "10px",
    gridTemplateColumns: `repeat(${colCount}, 1fr)`,
    gridAutoColumns: "minmax(100px, auto)",
    gap: margin,
  };

  console.log(blocksStyle);
  return (
    <>
      <Body
        page="block"
        title={name}
        description={description}
        image={attachment}
      >
        <div style={blocksStyle}>
          {childCategories.map((block, index) => {
            return (
              <Block key={index} block={block} widgetColor={widgetColor} />
            );
          })}
        </div>
      </Body>
      <div className="footer">
        <Button
          text="Back"
          type="back"
          onClickHandler={() => goToIntro()}
          style={{ backgroundColor: style.widgetColor }}
        />
      </div>
    </>
  );
}


export default Booking;
