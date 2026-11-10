import { toast } from "sonner";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Button, Card, CardContent, CardHeader, CardTitle,
  Input, MotionCard, Textarea,
} from "@/components/ui";
import { Field } from "@/components/Field";
import { Head } from "@/components/Head";

export default function HelpPage() {
  return (
    <>
      <Head
        title="Contact & help"
        desc="Find quick answers or send a message to the organization team."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <MotionCard delay={0.08}>
          <Card>
            <CardHeader><CardTitle>Send us a message</CardTitle></CardHeader>
            <CardContent>
              <form
                className="space-y-5"
                onSubmit={(e) => { e.preventDefault(); toast.success("Message sent"); }}
              >
                <Field label="Subject" id="subject">
                  <Input id="subject" placeholder="e.g. Issue with my remittance" />
                </Field>
                <Field label="Message" id="message">
                  <Textarea id="message" placeholder="Describe your question or issue…" />
                </Field>
                <Button>Send message</Button>
              </form>
            </CardContent>
          </Card>
        </MotionCard>

        <MotionCard delay={0.14}>
          <Card>
            <CardHeader><CardTitle>Frequently asked questions</CardTitle></CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {[
                  ["How long does review take?",
                   "Most remittances are reviewed within two school days."],
                  ["What proof can I upload?",
                   "Upload a clear JPG, PNG, or PDF of the deposit slip or receipt."],
                  ["Why was mine rejected?",
                   "Open the remittance detail to see the reviewer's reason."],
                ].map((x, i) => (
                  <AccordionItem value={`${i}`} key={i}>
                    <AccordionTrigger>{x[0]}</AccordionTrigger>
                    <AccordionContent>{x[1]}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </MotionCard>
      </div>
    </>
  );
}
