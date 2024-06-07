import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  return (
    <div className="two-charts">
      <Pie
        data={data}
        options={{
          title: {
            display: true,
            text: 'Students with warnings',
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'right'
          }
        }}
      />
    </div>
  );
};

export default PieChart;
