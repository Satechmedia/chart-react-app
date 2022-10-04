// Packages
import { useEffect, useRef, useState } from 'react';

// Library
import {
  formatPrice,
  usePrevious,
} from 'components/libraries/Common';

export default function PriceChange(props) {
  const {
    minimumFractionDigits,
    price,
  } = props;

  let
    cleaned = useRef(false);

  const prevProps = usePrevious({ price });

  const [priceClass, setPriceClass] = useState('');

  useEffect(() => {
    if (prevProps && prevProps.price) {
      if (price > prevProps.price) {
        setPriceClass('');
        if (!cleaned.current) {
          setTimeout(() => {
            setPriceClass('price_green');
          });
        }
      } else {
        setPriceClass('');
        if (!cleaned.current) {
          setTimeout(() => {
            setPriceClass('price_red');
          });
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  // First init
  useEffect(() => {
    cleaned.current = false;

    return function cleanup() {
      cleaned.current = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className={priceClass}>
      {minimumFractionDigits !== undefined && formatPrice(price, minimumFractionDigits)}
      {minimumFractionDigits === undefined && formatPrice(price)}
    </span>
  );
}