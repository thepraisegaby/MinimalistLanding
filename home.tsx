import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertSubscriberSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useForm } from "react-hook-form";

export default function Home() {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertSubscriberSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { email: string; name: string }) => {
      const res = await apiRequest("POST", "/api/subscribe", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your checklist is on its way to your inbox!",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md mx-auto bg-black border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Download className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-center text-white leading-tight">
            Fix Your Funnel in 10 Minutes!
          </h1>
          <p className="text-[#CCCCCC] text-center mt-4 text-base leading-relaxed">
            Download the Funnel Audit Checklist and optimize your funnel fast. Get insights to attract leads, nurture prospects, and drive conversions.
          </p>
          <p className="text-white text-center mt-6 text-sm font-medium">
            Join 100+ marketers optimizing their funnels today!
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Your name" 
                        {...field}
                        className="transition-all duration-200 focus:scale-[1.01] bg-[#444444] text-white border-gray-700 placeholder:text-gray-300 py-2"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your best email" 
                        {...field}
                        className="transition-all duration-200 focus:scale-[1.01] bg-[#444444] text-white border-gray-700 placeholder:text-gray-300 py-2"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full transition-all duration-200 hover:scale-[1.02] bg-white text-black hover:bg-gray-100 font-semibold text-lg py-6 shadow-lg hover:shadow-xl"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Processing..." : "Get Instant Access"}
              </Button>
              <p className="text-[#999999] text-center text-sm mt-2">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}