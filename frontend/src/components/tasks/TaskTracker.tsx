import * as React from "react";
import { Pie, PieChart, Label } from "recharts";
import { format, isSameDay, isSameWeek, isSameMonth } from "date-fns";

import { Task } from "@/hooks/useTasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = {
  tasks: Task[];
};

type Filter = "day" | "week" | "month" | "lifetime";

export function TaskTracker({ tasks }: Props) {
  const [filter, setFilter] = React.useState<Filter>("lifetime");
  const now = new Date();

  const filteredTasks = tasks.filter((task) => {
    const due = task.created_at ? new Date(task.created_at) : null;
    if (!due) return false;
    if (filter === "day") return isSameDay(now, due);
    if (filter === "week") return isSameWeek(now, due, { weekStartsOn: 0 });
    if (filter === "month") return isSameMonth(now, due);
    return true;
  });

  const completed = filteredTasks.filter((t) => t.is_complete).length;
  const pending = filteredTasks.filter((t) => !t.is_complete).length;
  const total = filteredTasks.length;

  const chartData = [
    { status: "Completed", count: completed, fill: "#4ade80" }, 
    { status: "Pending", count: pending, fill: "#e2e8f0" }, 
  ];

  const chartConfig = {
    count: { label: "Tasks" },
    Completed: { label: "Completed", color: "#4ade80" },
    Pending: { label: "Pending", color: "#e2e8f0" },
  } satisfies ChartConfig;

  return (
    <Card className="hidden lg:flex flex-col w-full max-w-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle>Stats</CardTitle>
        <CardDescription>{format(now, "MMMM yyyy")}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={3}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-3 text-sm">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(val) => val && setFilter(val as Filter)}
          className="w-full justify-center flex-wrap"
        >
          <ToggleGroupItem value="day" className="px-3">
            Day
          </ToggleGroupItem>
          <ToggleGroupItem value="week" className="px-3">
            Week
          </ToggleGroupItem>
          <ToggleGroupItem value="month" className="px-3">
            Month
          </ToggleGroupItem>
          <ToggleGroupItem value="lifetime" className="px-3">
            All
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="text-muted-foreground text-center">
          <span className="font-medium text-foreground">{completed}</span> done
          • <span className="font-medium text-foreground">{pending}</span>{" "}
          pending
        </div>
      </CardFooter>
    </Card>
  );
}
