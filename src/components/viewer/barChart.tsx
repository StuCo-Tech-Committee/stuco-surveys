import { IPusherSurveyResponse } from '@/controllers/survey.controller';
import ReactECharts from 'echarts-for-react';

export const BarChart = ({
  responses,
  current,
}: {
  responses: IPusherSurveyResponse[];
  current: number;
}) => {
  const values: { [index: string]: number } = {};

  responses.forEach((response) => {
    let number = response.answers[current].number!;
    values[number] = (values[number] || 0) + 1;
  });

  const options = {
    tooltip: {
      trigger: 'item',
    },
    xAxis: {
      type: 'category',
      data: Object.keys(values),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: Object.values(values),
        type: 'bar',
        color: ['#ba343b'],
      },
    ],
  };

  return <ReactECharts option={options} />;
};
