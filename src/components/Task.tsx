/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Kba15XkwcBq
 */
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import AddTask from "./AddTask";
import { ITasks } from "@/taskStorage";
import DeleteTask from "./DeleteTask";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";

export default function Task() {
  const [myTasks, setMyTasks] = useState<ITasks[]>();
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/tasks");
      if (res.ok) {
        setMyTasks(await res.json());
      }
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
    }
  };

  const updateTask = async (taskId: string) => {
    try {
      const res = await fetch("http://localhost:5000/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
        }),
      });
      console.log(res, "sres");

      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="px-2 md:px-12 lg:px-32">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Tasks</h1>
          </div>
          <div className="flex justify-center items-center w-full">
            <AddTask onTaskAdd={fetchTasks} />
          </div>
          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className=" font-bold text-xl ">
                    Complete
                  </TableHead>
                  <TableHead className="font-bold text-xl hidden md:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-xl">Task</TableHead>
                  <TableHead className=" font-bold text-xl hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="font-bold text-xl">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myTasks?.map((task) => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Switch
                          checked={task.status === "Completed"}
                          onCheckedChange={async () => {
                            await updateTask(task.id);
                          }}
                          color="green"
                          className="text-green-500"
                        />
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "hidden md:table-cell",
                            task.status === "Completed"
                              ? "text-green-500"
                              : "text-yellow-600",
                          )}
                        >
                          {task.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {task.description}
                      </TableCell>
                      <TableCell className="table-cell">
                        <DeleteTask taskId={task.id} updateTask={fetchTasks} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
