import React from "react";
import Navbar from "@/components/lumen/Navbar";
import Footer from "@/components/lumen/Footer";
import LabAnalyzer, { AnalyzeResponse } from "@/components/lumen/LabAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  Download,
  Trash2,
  Check,
} from "lucide-react";

interface FollowUpPlan {
  id: string;
  kind: "retest" | "consultation" | "lifestyle";
  dateISO: string; // start date/time
  notes: string;
  severity?: "green" | "yellow" | "red";
  abnormal?: { key: string; status: string; value: string }[];
  done?: boolean;
}

function formatDateTimeLocal(d: Date) {
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toICS(plan: FollowUpPlan) {
  const start = new Date(plan.dateISO);
  const dt = start
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const end = new Date(start.getTime() + 45 * 60 * 1000)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const titleMap = {
    retest: "Re-test Labs",
    consultation: "Doctor Consultation",
    lifestyle: "Lifestyle Plan Check-in",
  } as const;
  const title = `LUMEN: ${titleMap[plan.kind]}`;
  const descLines = [
    `Severity: ${plan.severity || "n/a"}`,
    plan.abnormal && plan.abnormal.length
      ? `Abnormal: ${plan.abnormal.map((a) => `${a.key} (${a.status}: ${a.value})`).join(", ")}`
      : "",
    plan.notes,
  ].filter(Boolean);
  const desc = descLines.join("\\n");
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//LUMEN//Lab Follow Up//EN\nBEGIN:VEVENT\nUID:${plan.id}@lumen\nDTSTAMP:${dt}\nDTSTART:${dt}\nDTEND:${end}\nSUMMARY:${title}\nDESCRIPTION:${desc.replace(/\n/g, "\\n")}\nEND:VEVENT\nEND:VCALENDAR`;
}

function useLocalPlans() {
  const key = "lab.followups";
  const [plans, setPlans] = React.useState<FollowUpPlan[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as FollowUpPlan[]) : [];
    } catch {
      return [];
    }
  });
  const persist = React.useCallback((next: FollowUpPlan[]) => {
    setPlans(next);
    localStorage.setItem(key, JSON.stringify(next));
  }, []);
  return {
    plans,
    add: (p: FollowUpPlan) => persist([p, ...plans]),
    toggleDone: (id: string) =>
      persist(plans.map((p) => (p.id === id ? { ...p, done: !p.done } : p))),
    remove: (id: string) => persist(plans.filter((p) => p.id !== id)),
  };
}

function FollowUpPlanner({ result }: { result: AnalyzeResponse | null }) {
  const { plans, add, toggleDone, remove } = useLocalPlans();
  const [kind, setKind] = React.useState<FollowUpPlan["kind"]>("retest");
  const [date, setDate] = React.useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [timeLocal, setTimeLocal] = React.useState<string>(() =>
    formatDateTimeLocal(new Date()),
  );
  const [notes, setNotes] = React.useState<string>("");

  React.useEffect(() => {
    if (result?.summary) {
      const base = result.summary;
      const abn = (result.items || []).filter(
        (i) => i.status === "low" || i.status === "high",
      );
      const suggestion =
        result.severity === "red"
          ? "Book a clinician consult within 48 hours."
          : result.severity === "yellow"
            ? "Re-test and review diet/medication."
            : "Maintain routine checkups.";
      setNotes(`${base} ${suggestion}`.trim());
    }
  }, [result]);

  React.useEffect(() => {
    const d = new Date(date);
    const [_, tm] = timeLocal.split("T");
    if (tm) {
      const [hh, mm] = tm.split(":");
      d.setHours(Number(hh || 9), Number(mm || 0), 0, 0);
      setDate(d);
    }
  }, [timeLocal]);

  const abnormal = (result?.items || []).filter(
    (i) => i.status === "low" || i.status === "high",
  );

  const savePlan = () => {
    const plan: FollowUpPlan = {
      id: `${Date.now()}`,
      kind,
      dateISO: date.toISOString(),
      notes,
      severity: result?.severity,
      abnormal: abnormal.map((i) => ({
        key: i.key,
        status: i.status,
        value: i.value,
      })),
    };
    add(plan);
  };

  const downloadICS = (p: FollowUpPlan) => {
    const blob = new Blob([toICS(p)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumen-follow-up-${p.id}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-blue" /> Plan Follow‑Up
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={kind} onValueChange={(v) => setKind(v as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retest">Re-test labs</SelectItem>
                  <SelectItem value="consultation">
                    Doctor consultation
                  </SelectItem>
                  <SelectItem value="lifestyle">Lifestyle check-in</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date & Time</label>
              <div className="mt-1 grid grid-cols-1 gap-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  className="rounded-md border"
                />
                <Input
                  type="datetime-local"
                  value={formatDateTimeLocal(date)}
                  onChange={(e) => setTimeLocal(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              className="mt-1"
              placeholder="Next steps, questions for your doctor, lifestyle changes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {abnormal.length > 0 && (
            <div className="text-sm">
              <div className="font-medium mb-1">Abnormal values</div>
              <ul className="grid sm:grid-cols-2 gap-2">
                {abnormal.map((i) => (
                  <li
                    key={i.key}
                    className="rounded-md border p-2 flex items-center justify-between"
                  >
                    <span>
                      {i.key}: {i.value}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${i.status === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {i.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button onClick={savePlan} className="flex items-center gap-2">
              <Bell className="w-4 h-4" /> Save Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-brand-blue" /> Saved Plans
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No follow‑ups yet. Create one on the left.
            </p>
          ) : (
            <ul className="space-y-2">
              {plans.map((p) => (
                <li key={p.id} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">
                        {p.kind === "retest"
                          ? "Re-test labs"
                          : p.kind === "consultation"
                            ? "Doctor consultation"
                            : "Lifestyle check-in"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(p.dateISO).toLocaleString()}{" "}
                        {p.severity ? `• ${p.severity}` : ""}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={p.done ? "outline" : "default"}
                        onClick={() => toggleDone(p.id)}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />{" "}
                        {p.done ? "Mark Undone" : "Mark Done"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadICS(p)}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Calendar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => remove(p.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </Button>
                    </div>
                  </div>
                  {p.notes && <div className="mt-2 text-sm">{p.notes}</div>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LabPage() {
  const [result, setResult] = React.useState<AnalyzeResponse | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <section className="container space-y-6">
          <h1 className="text-3xl font-bold">
            Lab Report Analyzer & Follow‑Up
          </h1>
          <Card>
            <CardHeader>
              <CardTitle>Upload Lab Report</CardTitle>
            </CardHeader>
            <CardContent>
              <LabAnalyzer onResult={setResult} />
            </CardContent>
          </Card>

          <FollowUpPlanner result={result} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
