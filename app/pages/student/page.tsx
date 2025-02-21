"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/Firebase"; // Adjust the path as necessary
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; // Adjust the import path for ShadCN UI
import { Button } from "@/components/ui/button"; // Adjust the import path for ShadCN UI
import { Input } from "@/components/ui/input"; // Adjust the import path for ShadCN UI
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"; // Adjust the import path for ShadCN UI
import { ChevronDown } from "lucide-react"; // Assuming you're still using lucide-react for icons
import * as XLSX from "xlsx"; // Import the xlsx library

export type Attendance = {
  id: string;
  date: string; // Date of attendance
  status: string; // Attendance status
  name: string; // Name of the teacher
};

export type Teachers = {
  id: string;
  name: string;
  phone: string;
  email: string; // Assuming there's an email field
};

export default function DataTableDemo() {
  const [teachersData, setTeachersData] = useState<Teachers[]>([]); // State for teachers data
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]); // State for attendance data
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({
    name: true,
    phone: true,
  });
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teachers | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    const fetchTeachersData = async () => {
      const querySnapshot = await getDocs(collection(db, "student-atendance"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Teachers[];
      setTeachersData(data);
    };

    fetchTeachersData();
  }, []);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      const querySnapshot = await getDocs(collection(db, "student-atendance")); // Change to the correct collection for attendance
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Attendance[];
      setAttendanceData(data);
    };

    fetchAttendanceData();
  }, []);

  // Remove duplicates based on name and email
  const uniqueTeachersData = React.useMemo(() => {
    const uniqueMap = new Map();
    teachersData.forEach((teacher) => {
      const key = `${teacher.name}-${teacher.email}`; // Create a unique key based on name and email
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, teacher);
      }
    });
    return Array.from(uniqueMap.values());
  }, [teachersData]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      // {
      //   accessorKey: "phone",
      //   header: "Phone",
      // },
      // {
      //   accessorKey: "email",
      //   header: "email",
      // },
    ],
    []
  );

  const table = useReactTable({
    data: uniqueTeachersData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleRowClick = (teacher: Teachers) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const downloadXLSX = (data: Attendance[], filename: string) => {
    // Restructure data to place dates at the top
    const formattedData = data.map(attendance => ({
      Date: attendance.date,
      Name: attendance.name,
      Status: attendance.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Data");
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="overflow-x-auto w-full p-6">
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => downloadXLSX(attendanceData, "attendance-student.xlsx")}
          >
            Download Attendance
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleRowClick(row.original)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Modal for Attendance Table */}
      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-11/12 max-w-4xl p-6 rounded-md shadow-lg flex flex-col space-y-4 overflow-y-auto">
            <h2 className="text-xl font-bold">
              Attendance for {selectedTeacher.name}
            </h2>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData
                    .filter(
                      (attendance) =>
                        attendance.name === selectedTeacher.name
                    )
                    .map((attendance) => (
                      <TableRow key={attendance.id}>
                        <TableCell>{selectedTeacher.name}</TableCell>
                        <TableCell>{attendance.date}</TableCell>
                        <TableCell>{attendance.status}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <Button onClick={closeModal} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
