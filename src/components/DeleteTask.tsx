import { Button } from "./ui/button";

export default function DeleteTask({
  taskId,
  updateTask,
}: {
  taskId: string;
  updateTask: () => void;
}) {
  const handleDeleteTask = async () => {
    const res = await fetch(`http://localhost:5000/delete-task/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId,
      }),
    });
    if (res.ok) {
      updateTask();
    }
    console.log(res);
  };
  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={async () => {
        await handleDeleteTask();
      }}
    >
      Delete
    </Button>
  );
}
