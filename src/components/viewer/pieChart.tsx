import { IPusherSurveyResponse } from '@/controllers/survey.controller';
import ReactECharts from 'echarts-for-react';

export function PieChart({
  responses,
  current,
}: {
  responses: IPusherSurveyResponse[];
  current: number;
}) {
  const values: { [index: string]: number } = {};
  
  responses.forEach((response) => {
    let choice = response.answers[current].choices![0];

    if (!values[choice]) {
      values[choice] = 1;
    } else {
      values[choice] = values[choice] + 1;
    }
  });

  let data: [{ name: string; value: number }?] = [];
  Object.keys(values).forEach(function (key) {
    data.push({ name: key, value: values[key] });
  });

  return (
    <ReactECharts
      option={{
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: data,
          },
        ],
        animation: false,
      }}
    />
  );
}
