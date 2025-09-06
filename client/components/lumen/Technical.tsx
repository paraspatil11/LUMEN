import React, { useRef } from "react";
import {
  BookOpen,
  Cpu,
  Shield,
  Workflow,
  Link2,
  Github,
  Linkedin,
  User as UserIcon,
  Mic,
  Image as ImageIcon,
  Upload,
  BadgeAlert,
} from "lucide-react";

import ZoomableImage from "./ZoomableImage";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnimatedBeam } from "./AnimatedBeam";
import DevProfileCard from "./DevProfileCard";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">{title}</h3>
      <div className="mt-3 text-sm text-muted-foreground space-y-3">
        {children}
      </div>
    </div>
  );
}

function BeamShowcase() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const openaiRef = useRef<HTMLDivElement | null>(null);
  const featureRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];

  const features = [
    { label: "Audio", Icon: Mic },
    { label: "Image", Icon: ImageIcon },
    { label: "Upload", Icon: Upload },
    { label: "Alerts", Icon: BadgeAlert },
  ];

  return (
    <div ref={containerRef} className="relative h-72 w-full">
      {/* Beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={userRef}
        toRef={openaiRef}
        curvature={-60}
        pathColor="#60A5FA"
        pathWidth={2}
        gradientStartColor="#60A5FA"
        gradientStopColor="#22D3EE"
      />
      {featureRefs.map((ref, i) => (
        <AnimatedBeam
          key={i}
          containerRef={containerRef}
          fromRef={openaiRef}
          toRef={ref}
          curvature={-40 - i * 6}
          delay={i * 0.2}
          pathColor="#60A5FA"
          pathWidth={2}
          gradientStartColor="#60A5FA"
          gradientStopColor="#22D3EE"
        />
      ))}

      {/* Nodes */}
      <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: User */}
        <div className="flex flex-col items-center">
          <div
            ref={userRef}
            className="ml-2 size-16 rounded-full bg-secondary border border-border shadow grid place-items-center"
          >
            <img
              src="https://cdn.simpleicons.org/openai/1B8EE6"
              alt="OpenAI"
              className="h-6 w-6"
            />
          </div>
          <span className="mt-2 text-sm font-medium">User</span>
        </div>

        {/* Center: OpenAI */}
        <div className="flex flex-col items-center">
          <div
            ref={openaiRef}
            className="size-20 rounded-full bg-gradient-to-tr from-brand-blue/20 to-brand-teal/30 border border-border shadow grid place-items-center"
          >
            <img
              src="https://cdn.simpleicons.org/openai/1B8EE6"
              alt="OpenAI"
              className="h-6 w-6"
            />
          </div>
          <div className="mt-2 inline-flex items-center text-xs text-muted-foreground">
            <Link2 className="mr-1 h-3 w-3" /> LUMEN Runtime
          </div>
        </div>

        {/* Right: Features */}
        <div className="flex justify-end pr-2">
          <div className="grid gap-3">
            {features.map(({ label, Icon }, idx) => (
              <div key={label} className="flex items-center gap-2 justify-end">
                <div
                  ref={featureRefs[idx]}
                  className="size-12 rounded-full bg-white shadow border border-border grid place-items-center"
                >
                  <Icon className="text-brand-blue" size={18} />
                </div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TechStackGrid() {
  const techs = [
    { slug: "openai", label: "OpenAI", color: "1B8EE6" },
    { slug: "huggingface", label: "Hugging Face", color: "FF6A00" },
    { slug: "react", label: "React", color: "61DAFB" },
    { slug: "tailwindcss", label: "Tailwind CSS", color: "06B6D4" },

    { slug: "framer", label: "Framer Motion", color: "0055FF" },
    { slug: "nodedotjs", label: "Node.js", color: "339933" },
    { slug: "express", label: "Express", color: "000000" },
    { slug: "netlify", label: "Netlify", color: "00C7B4" },

    { slug: "vercel", label: "Vercel", color: "000000" },
    { slug: "firebase", label: "Firebase", color: "FFCA28" },
    { slug: "supabase", label: "Supabase", color: "3ECF8E" },
    { slug: "docker", label: "Docker", color: "2496ED" },

    { slug: "github", label: "GitHub", color: "181717" },
    { slug: "figma", label: "Figma", color: "F24E1E" },
    { slug: "postgresql", label: "PostgreSQL", color: "336791" },
    { slug: "railway", label: "Railway", color: "000000" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      {techs.map((t) => (
        <div
          key={t.slug}
          className="flex flex-col items-center p-3 bg-card/80 border border-border rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-white grid place-items-center p-2">
            <img
              src={`https://cdn.simpleicons.org/${t.slug}/${t.color}`}
              alt={t.label}
              className="w-8 h-8"
            />
          </div>
          <span className="mt-2 text-xs font-medium text-center">
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function TeamCard({
  name,
  role,
  photo,
  github,
  linkedin,
}: {
  name: string;
  role: string;
  photo?: string;
  github?: string;
  linkedin?: string;
}) {
  return (
    <div className="relative w-full max-w-[380px] h-[384px] flex flex-col items-center rounded-[20px] bg-white shadow-lg border border-gray-100">
      {/* Triangular Background Pattern */}
      <div className="h-48 w-full rounded-t-[20px] overflow-hidden relative pr-7">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `
              linear-gradient(60deg, hsl(var(--brand-blue)) 25%, transparent 25.5%, transparent 75%, hsl(var(--brand-blue)) 75%, hsl(var(--brand-blue))),
              linear-gradient(120deg, hsl(var(--brand-teal)) 25%, transparent 25.5%, transparent 75%, hsl(var(--brand-teal)) 75%, hsl(var(--brand-teal))),
              linear-gradient(60deg, hsl(var(--brand-blue)) 25%, transparent 25.5%, transparent 75%, hsl(var(--brand-blue)) 75%, hsl(var(--brand-blue))),
              linear-gradient(120deg, hsl(var(--brand-teal)) 25%, transparent 25.5%, transparent 75%, hsl(var(--brand-teal)) 75%, hsl(var(--brand-teal)))
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 0 0, 20px 20px, 20px 20px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      </div>

      {/* Avatar */}
      <div className="absolute w-[114px] h-[114px] bg-white rounded-full flex justify-center items-center top-[calc(50%-57px)] border-4 border-white shadow-lg">
        {photo ? (
          <img
            src={photo}
            alt={`${name} photo`}
            className="w-[100px] h-[100px] rounded-full object-cover object-top"
          />
        ) : (
          <div className="w-[100px] h-[100px] rounded-full bg-muted grid place-items-center text-muted-foreground text-xs">
            Photo
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col items-center pt-[60px] px-4">
        <h3 className="font-medium text-lg text-black">{name}</h3>
        <p className="mt-2.5 font-normal text-[15px] text-[#78858F] text-center">
          {role}
        </p>

        <div className="mt-4 flex gap-2">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent transition-all duration-300"
            >
              <Github size={16} />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent transition-all duration-300"
            >
              <Linkedin size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Technical() {
  return (
    <section id="technical" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-6 grid lg:grid-cols-1 gap-6">
          <Card title="LUMEN ↔ OpenAI Feature Flow">
            <BeamShowcase />
          </Card>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <Card title="Problem Statement">
            <ul className="list-disc pl-5 space-y-1">
              <li>India faces uneven access to timely, quality healthcare.</li>
              <li>
                Rural populations (~65%) have limited primary and specialist
                care.
              </li>
              <li>
                Doctor density is ~20.6 per 10,000 versus WHO's 44.5 benchmark.
              </li>
              <li>
                Preventable emergencies (e.g., ~58,000 snakebite deaths
                annually) persist due to delayed triage and guidance.
              </li>
            </ul>
            <p>
              LUMEN addresses this with a unified assistant that triages
              symptoms, explains diagnostics, reconstructs low-dose CT,
              interprets lab reports, and maps people to government schemes—in
              their language.
            </p>
          </Card>

          <Card title="Key Features">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Symptoms-based triage with severity bands (green/yellow/red) and
                next steps.
              </li>
              <li>
                AI specialist modules (dermatology, radiology, cardiology) for
                contextual guidance.
              </li>
              <li>
                PEARL-inspired CT reconstruction preview for lower dose, clearer
                images.
              </li>
              <li>
                Lab report analyzer that extracts values, flags risks, and
                suggests follow-up.
              </li>
              <li>
                Government schemes assistant that checks eligibility and steps.
              </li>
              <li>
                Emergency education tiles with audio guidance for first aid.
              </li>
              <li>Multi-language UX for accessibility across India.</li>
            </ul>
          </Card>
        </div>

        <div className="mt-6 grid lg:grid-cols-1 gap-6">
          <Card title="System Architecture (WIP)">
            <div className="space-y-3">
              <p>
                High-level diagram exported from Eraser. Use the controls to
                zoom and pan.
              </p>
              <Tabs defaultValue="d1" className="w-full">
                <TabsList className="bg-secondary rounded-lg p-1">
                  <TabsTrigger
                    value="d1"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
                  >
                    Diagram 1
                  </TabsTrigger>
                  <TabsTrigger
                    value="d2"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
                  >
                    Diagram 2
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="d1" className="mt-3">
                  <ZoomableImage
                    src="https://cdn.builder.io/api/v1/image/assets%2F445519f4dc2147579ea6fb2243527f29%2F386c959d2e0945409ec9e98dd27c0526?format=webp&width=2000"
                    alt="LUMEN system architecture (Eraser export)"
                  />
                </TabsContent>
                <TabsContent value="d2" className="mt-3">
                  <ZoomableImage
                    src="https://cdn.builder.io/api/v1/image/assets%2F445519f4dc2147579ea6fb2243527f29%2F4f9ef3ba46934b92935a7f7fbac88080?format=webp&width=2000"
                    alt="LUMEN system architecture zoomed blocks (Eraser export)"
                  />
                </TabsContent>
              </Tabs>
              <p className="text-xs">
                Diagrams are conceptual and not final; implementation may
                evolve.
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <Card title="Core Workflows / Pipelines">
            <div className="space-y-3">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Workflow className="text-brand-teal" /> Symptom Triage
                </div>
                <ol className="list-decimal pl-5 space-y-1 mt-1">
                  <li>
                    Client collects text/audio/image and metadata (locale,
                    consent).
                  </li>
                  <li>
                    API gateway validates, anonymizes, and performs safety
                    checks.
                  </li>
                  <li>
                    Router invokes GPT reasoning + tools (medical facts, vector
                    search, calculators).
                  </li>
                  <li>
                    Response is structured (severity, differential, next steps,
                    red flags) and localized.
                  </li>
                </ol>
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Cpu className="text-brand-blue" /> CT Reconstruction
                  (PEARL-inspired)
                </div>
                <ol className="list-decimal pl-5 space-y-1 mt-1">
                  <li>
                    Upload DICOM series — pre-processing (denoise, normalize).
                  </li>
                  <li>
                    Low-dose reconstruction engine produces enhanced
                    slices/volume.
                  </li>
                  <li>
                    Viewer renders 3D/axial previews and exports summaries.
                  </li>
                  <li>
                    Safety guardrails ensure non-diagnostic disclaimer and dose
                    notes.
                  </li>
                </ol>
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Shield className="text-cta" /> Safety & Privacy
                </div>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>
                    PII minimization, content filters, and rate limiting at
                    gateway.
                  </li>
                  <li>Human-in-the-loop escalation for high-risk outputs.</li>
                  <li>
                    Audit logs and red-teaming prompts for continuous
                    evaluation.
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Team LUMEN Section */}
        <div className="mt-10">
          <div className="grid lg:grid-cols-1 gap-6">
            <Card title="Novelty & Differentiators">
              <div className="space-y-2">
                <p className="text-sm">
                  <BookOpen className="inline mr-2" /> LUMEN differs from
                  generic AI models in key ways—see{" "}
                  <a href="/README.md" className="text-brand-blue underline">
                    README.md
                  </a>{" "}
                  for the full project overview.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Multimodal, localized triage: voice/text/image inputs with
                    regional language prompts and voice-first UX (not just
                    English-only chat models).
                  </li>
                  <li>
                    Clinical‑aware imaging (PEARL): geometry‑aware low‑dose CT
                    reconstruction producing uncertainty maps for safer
                    follow‑up decisions — beyond simple image captioning.
                  </li>
                  <li>
                    Structured lab report parsing & evaluation: Donut/OCR +
                    reference‑range comparison that returns fields, risk flags
                    and suggested follow‑ups rather than freeform summaries.
                  </li>
                  <li>
                    Grounded government scheme retrieval: embeddings + small
                    vector DB to match user queries to state/national schemes
                    with eligibility and helpline details.
                  </li>
                  <li>
                    Safety‑first pipelines: PII minimization, content filters,
                    human‑in‑the‑loop escalation for high‑risk outputs and
                    explicit non‑diagnostic disclaimers.
                  </li>
                  <li>
                    Extensible service mesh: lightweight Express endpoints and
                    optional Python FastAPI services for heavier, on‑device or
                    server‑side ML workloads.
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  Icons and vectors across the site emphasize the operational
                  differences (retrieval, uncertainty maps, structured fields).
                  Refer to <code>/README.md</code> for citations and detailed
                  comparisons.
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <div className="grid lg:grid-cols-1 gap-6">
            <Card title="Tech Stack Cloud">
              <div className="space-y-4">
                <div>
                  <ul className="list-disc pl-5 space-y-2">
                    <li className="text-sm">
                      Main AI Platform: OpenAI (GPT-4, Whisper, DALL·E)
                    </li>
                    <li className="text-sm">
                      Prototype / Alternatives: Hugging Face models (Indic‑GPT,
                      Donut, BLIP)
                    </li>
                    <li className="text-sm">
                      Student Innovation: PEARL CT (PerX2CT + XctDiff +
                      SAX‑NeRF)
                    </li>
                    <li className="text-sm">
                      Deployment & Data: Netlify / Render / Railway, Firebase /
                      Supabase, Vector DB (FAISS / pgvector)
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <TechStackGrid />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <div className="grid lg:grid-cols-1 gap-6">
            <Card title="OpenAI Models Used">
              <div className="p-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm table-auto">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground">
                        <th className="px-3 py-2">Feature</th>
                        <th className="px-3 py-2">OpenAI Model / Tool</th>
                        <th className="px-3 py-2">
                          Prototype Model (Hugging Face)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-3 py-2 align-top">
                          Multilingual Chatbot (Core Conversations)
                        </td>
                        <td className="px-3 py-2 align-top">
                          GPT-4 / GPT-5 (chat completion)
                        </td>
                        <td className="px-3 py-2 align-top">
                          <code className="rounded px-1 py-0.5 bg-muted text-xs">
                            ai4bharat/indic-gpt
                          </code>
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="px-3 py-2 align-top">
                          Voice Input (Speech → Text)
                        </td>
                        <td className="px-3 py-2 align-top">Whisper (ASR)</td>
                        <td className="px-3 py-2 align-top">
                          <code className="rounded px-1 py-0.5 bg-muted text-xs">
                            openai/whisper-small
                          </code>
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="px-3 py-2 align-top">
                          Voice Output (Text → Speech)
                        </td>
                        <td className="px-3 py-2 align-top">
                          OpenAI TTS (text-to-speech)
                        </td>
                        <td className="px-3 py-2 align-top">
                          <code className="rounded px-1 py-0.5 bg-muted text-xs">
                            coqui/XTTS-v2
                          </code>
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="px-3 py-2 align-top">
                          Lab Report Analyzer (OCR + Interpretation)
                        </td>
                        <td className="px-3 py-2 align-top">
                          GPT-4 / GPT-5 (explanation + follow-up)
                        </td>
                        <td className="px-3 py-2 align-top">
                          <code className="rounded px-1 py-0.5 bg-muted text-xs">
                            naver-clova-ix/donut-base-finetuned-docvqa
                          </code>
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="px-3 py-2 align-top">
                          Image-based Dermatology / Skin Issues
                        </td>
                        <td className="px-3 py-2 align-top">
                          GPT-4-Vision (image understanding + summaries)
                        </td>
                        <td className="px-3 py-2 align-top">
                          <code className="rounded px-1 py-0.5 bg-muted text-xs">
                            Salesforce/blip-image-captioning-base
                          </code>
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="px-3 py-2 align-top">
                          Emergency Triage & First Aid Education
                        </td>
                        <td className="px-3 py-2 align-top">
                          GPT-4 / GPT-5 (retrieval-grounded responses)
                        </td>
                        <td className="px-3 py-2 align-top">
                          <code className="rounded px-1 py-0.5 bg-muted text-xs">
                            sentence-transformers/all-mpnet-base-v2
                          </code>
                        </td>
                      </tr>

                      <tr className="border-t">
                        <td className="px-3 py-2 align-top">
                          Government Schemes & Benefits Assistant
                        </td>
                        <td className="px-3 py-2 align-top">
                          GPT-4 / GPT-5 (retrieval-grounded responses)
                        </td>
                        <td className="px-3 py-2 align-top">
                          <code className="rounded px-1 py-0.5 bg-muted text-xs">
                            sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
                          </code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  Note: For the prototype phase we currently use free Hugging
                  Face models (listed in the third column) where possible.
                  Production may switch to commercial OpenAI models or hosted
                  solutions for reliability and latency.
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-20">
          <div className="relative flex justify-center w-full overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1600px] px-6 justify-items-center">
              <DevProfileCard
                name="Sanchit"
                role="Full Stack Developer"
                photo="https://cdn.builder.io/api/v1/image/assets%2F445519f4dc2147579ea6fb2243527f29%2F4587d99ad8074e819191cef9f9a8a2c7?format=webp&width=800"
                github="https://github.com/sanchit1606"
                linkedin="https://www.linkedin.com/in/sanchit1606/"
              />
              <DevProfileCard
                name="Priyal"
                role="AI/ML Engineer"
                github="https://github.com/priyal-username"
                linkedin="https://www.linkedin.com/in/priyal-profile/"
              />
              <DevProfileCard
                name="Paras"
                role="Backend Developer"
                photo="https://cdn.builder.io/api/v1/image/assets%2Fe15e28af565249a28e9186f98d17e5d6%2F724f568f937d459e956850b221bb91ac?format=webp&width=800"
                github="https://github.com/paraspatil11"
                linkedin="https://linkedin.com/in/ParasPatil"
              />
              <DevProfileCard
                name="Kshitij"
                role="Frontend Developer"
                photo="https://cdn.builder.io/api/v1/image/assets%2F445519f4dc2147579ea6fb2243527f29%2Fad5f0becc276472fbcdb59aafec6d377?format=webp&width=800"
                github="https://github.com/okshitij"
                linkedin="https://www.linkedin.com/in/kshitij-kalrao/"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
