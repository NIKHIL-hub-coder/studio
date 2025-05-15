"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  source: z.string().optional(),
  count: z.coerce.number().min(1).max(10).optional().default(3),
});

export type TopicFormValues = z.infer<typeof formSchema>;

interface TopicFormProps {
  onSubmit: (values: TopicFormValues) => void;
  isLoading: boolean;
}

export function TopicForm({ onSubmit, isLoading }: TopicFormProps) {
  const form = useForm<TopicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      source: "",
      count: 3,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AI advancements" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., bbc.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Articles (1-10)</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Fetch News
        </Button>
      </form>
    </Form>
  );
}
