import React from "react";

interface SwipeableCardRowProps {
  children: React.ReactNode;
}

const SwipeableCardRow: React.FC<SwipeableCardRowProps> = ({
  children,
}) => {
  return (
    <div className="min-w-0">

      <div
        className="
          grid
          grid-cols-2
          gap-2

          sm:gap-3
        "
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="
              min-w-0
              h-[190px]

              sm:h-[235px]
            "
          >
            {child}
          </div>
        ))}
      </div>

    </div>
  );
};

export default SwipeableCardRow;