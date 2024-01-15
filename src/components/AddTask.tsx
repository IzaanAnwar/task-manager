import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCallback, useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";

export default function AddTask({ onTaskAdd }: { onTaskAdd: () => void }) {
  const [task, setTask] = useState<string>();
  const [description, setDescription] = useState<string>();
  const handleAddTask = useCallback(async () => {
    if (!task) {
      toast({
        title: "Input Error",
        description: "Please add Task name",
        variant: "destructive",
      });

      return;
    }
    if (!description) {
      toast({
        title: "Input Error",
        description: "Please add Task Description",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("hiy");

      const res = await fetch("http://localhost:5000/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: task,
          description,
        }),
      });
      if (res.ok) {
        onTaskAdd();
        setTask("");
        setDescription("");
      }
      console.log(res);
    } catch (error) {
      console.log("🚀 ~ handleAddTask ~ error:", error);
    }
  }, [description, onTaskAdd, task]);

  return (
    <form className="mb-4 space-y-4 w-full md:w-80 lg:w-96">
      <Input
        className="w-full bg-white shadow-none appearance-none pl-2  dark:bg-gray-950"
        placeholder="New task..."
        type="text"
        value={task}
        onChange={(e) => {
          setTask(e.target.value);
        }}
      />
      <Textarea
        className="w-full bg-white shadow-none appearance-none pl-2  dark:bg-gray-950"
        placeholder="Description..."
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <div className="flex justify-center items-center px-2">
        <Button className="mt-2 w-full" size="sm" onClick={handleAddTask}>
          Submit
        </Button>
      </div>
    </form>
  );
}
