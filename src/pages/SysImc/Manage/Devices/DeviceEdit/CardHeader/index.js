import React from 'react';
import IconTitle from './IconTitle';
import HorizontalLine from './HorizontalLine';

const CardHeader = ({ title }) => {
  return (
    <div>
      <IconTitle title={title} />
      <HorizontalLine style={{ marginTop: 2 }} />
    </div>
  );
};
export default CardHeader;
