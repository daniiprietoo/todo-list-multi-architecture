import { createTask } from "@/api/api";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { toast } from "sonner";
import type { TraceStep } from "./trace-diagram";

type CreateTaskFormProps = {
  userId: number;
  architecture: import("@/components/architecture-selector").Architecture;
  className?: string;
  props?: React.ComponentProps<"div">;
  onTaskCreated?: () => void;
  setTrace: (trace: TraceStep[]) => void;
};

export function CreateTaskForm({
  userId,
  architecture,
  className,
  onTaskCreated,
  setTrace,
  ...props
}: CreateTaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const response = await createTask(
      {
        title: formData.title,
        description: formData.description,
        userId: userId,
      },
      architecture
    );

    if (response.success) {
      setFormData({ title: "", description: "" });
      setTrace(response.trace ?? []);
      if (onTaskCreated) onTaskCreated();
      toast.success("Task created successfully!");
    } else {
      console.error(response.message);
      setError(response.message);
      setTrace(response.trace ?? []);
      toast.error(response.message || "Failed to create task");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create a new task</CardTitle>
          <CardDescription>Enter the task details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Buy groceries"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  required
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Create task
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
