"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Label,
  Pie,
  PieChart,
  Tooltip,
} from "recharts";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/Firebase"; // Adjust the import path for your Firebase config
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

export default function Page() {
  const [teachersCount, setTeachersCount] = React.useState(0);
  const [studentsCount, setStudentsCount] = React.useState(0);
  const [barChartData, setBarChartData] = React.useState<
    { month: string; teachers: number; students: number }[]
  >([]);
  const [pieChartData, setPieChartData] = React.useState<
    { category: string; value: number; fill: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch data from Firestore
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersSnapshot = await getDocs(collection(db, "teachers-atendance")); // Firestore collection for teachers
        setTeachersCount(teachersSnapshot.size);

        const studentsSnapshot = await getDocs(collection(db, "student-atendance")); // Firestore collection for students
        setStudentsCount(studentsSnapshot.size);

        // Example data for bar chart with separate counts for teachers and students
        const barData = [
          {
            month: "January",
            teachers: teachersSnapshot.size,
            students: studentsSnapshot.size,
          },
          {
            month: "February",
            teachers: teachersSnapshot.size,
            students: studentsSnapshot.size,
          },
          {
            month: "March",
            teachers: teachersSnapshot.size,
            students: studentsSnapshot.size,
          },
          {
            month: "April",
            teachers: teachersSnapshot.size,
            students: studentsSnapshot.size,
          },
          {
            month: "May",
            teachers: teachersSnapshot.size,
            students: studentsSnapshot.size,
          },
          {
            month: "June",
            teachers: teachersSnapshot.size,
            students: studentsSnapshot.size,
          },
        ];
        setBarChartData(barData);

        // Example data for pie chart
        const pieData = [
          {
            category: "Teachers",
            value: teachersSnapshot.size,
            fill: "red", // Set color to red for teachers
          },
          {
            category: "Students",
            value: studentsSnapshot.size,
            fill: "yellow", // Set color to yellow for students
          },
        ];
        setPieChartData(pieData);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 justify-center mb-4 w-full">
            {/* Card for Teachers */}
            <Card className="flex flex-col h-full w-[40%] ">
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
                <CardDescription>Total Number of Teachers</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-2xl font-bold">{teachersCount}</p>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                  Total number of teachers in the system.
                </div>
              </CardFooter>
            </Card>

            {/* Card for Students */}
            <Card className="flex flex-col h-full w-[40%]">
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>Total Number of Students</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-2xl font-bold">{studentsCount}</p>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                  Total number of students in the system.
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Bar Chart - Teacher and Student Data</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <ChartContainer config={{ /* Add your ChartConfig properties here */ }}>
                  <BarChart data={barChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="teachers" fill="red" radius={4} /> {/* Set color to red for teachers */}
                    <Bar dataKey="students" fill="yellow" radius={4} /> {/* Set color to yellow for students */}
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Pie Chart - Distribution of Teachers and Students</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-0 flex-grow">
                <ChartContainer className="mx-auto aspect-square max-h-[250px]" config={{ /* Add your ChartConfig properties here */ }}>
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="category"
                      innerRadius={60}
                      strokeWidth={5}
                      labelLine={false}
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
                                  {teachersCount + studentsCount}
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
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2"></div>
                    <span>Teachers: {teachersCount}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                    <span>Students: {studentsCount}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
