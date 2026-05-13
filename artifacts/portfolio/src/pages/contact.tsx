import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSendContactMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { t } = useLang();
  const { toast } = useToast();
  const sendMessage = useSendContactMessage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    sendMessage.mutate({ data }, {
      onError: () => {
        toast({
          title: "Error",
          description: t("contact.error"),
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-8rem)] pt-12 pb-24 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6" data-testid="text-contact-title">
              {t("contact.title")}
            </h1>
            <p className="text-xl text-muted-foreground font-mono mb-12 max-w-md" data-testid="text-contact-subtitle">
              {t("contact.subtitle")}
            </p>

            <div className="flex flex-col gap-6 font-mono mt-auto">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="p-3 bg-secondary/50 rounded-full text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-1">Email</div>
                  <a href={`mailto:${t("contact.info_email")}`} className="text-foreground hover:text-primary transition-colors">
                    {t("contact.info_email")}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="p-3 bg-secondary/50 rounded-full text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-1">Location</div>
                  <span className="text-foreground">{t("contact.info_location")}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-medium mt-8 self-start" data-testid="badge-contact-status">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t("hero.badge")}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border/50 rounded-xl p-6 md:p-8"
          >
            {sendMessage.isSuccess ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-mono mb-2" data-testid="text-contact-success">{t("contact.success")}</h3>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs uppercase tracking-wider">{t("contact.name_label")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("contact.name_placeholder")} className="font-mono bg-secondary/30 rounded-none border-border/50" data-testid="input-contact-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs uppercase tracking-wider">{t("contact.email_label")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("contact.email_placeholder")} className="font-mono bg-secondary/30 rounded-none border-border/50" data-testid="input-contact-email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs uppercase tracking-wider">{t("contact.subject_label")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("contact.subject_placeholder")} className="font-mono bg-secondary/30 rounded-none border-border/50" data-testid="input-contact-subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs uppercase tracking-wider">{t("contact.message_label")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t("contact.message_placeholder")} className="font-mono min-h-[150px] bg-secondary/30 rounded-none border-border/50" data-testid="input-contact-message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full font-mono font-bold tracking-tight rounded-none h-14" 
                    disabled={sendMessage.isPending}
                    data-testid="btn-contact-submit"
                  >
                    {sendMessage.isPending ? t("contact.sending") : t("contact.send")}
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
