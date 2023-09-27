import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { periodHistory } from "~/data";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active) {
    return (
      <div className="flex flex-col gap-2">
        <span>כמות שתיות : {payload?.[0]?.value}</span>
        <span>תקופה : {label}</span>
      </div>
    );
  }

  return null;
};

export default function ToastsHistory() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <h1 className="text-4xl">גרף היסטורי</h1>
      <ResponsiveContainer>
        <LineChart
          width={500}
          height={300}
          data={periodHistory}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="toasts"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="שתיות"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
