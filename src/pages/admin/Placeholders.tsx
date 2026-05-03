import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

export function AdminPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="container-page py-10">
      <Helmet><title>{title} — Admin</title></Helmet>
      <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Card><CardContent className="py-16 text-center text-muted-foreground">
        This admin area is coming up next. We've laid the foundation — full CRUD, dataset uploads, submissions queue, and certificate issuance arrive in the upcoming phases.
      </CardContent></Card>
    </div>
  );
}

export const AdminLearners = () => <AdminPlaceholder title="Learners" description="See progress, scores, and outputs for every learner." />;
export const AdminCurriculum = () => <AdminPlaceholder title="Curriculum" description="Create and edit tracks, modules, lessons, quizzes, and SQL exercises." />;

export const AdminSubmissions = () => <AdminPlaceholder title="Submissions" description="Review project submissions, score them against the rubric, and leave feedback." />;
export const AdminCertificates = () => <AdminPlaceholder title="Certificates" description="Issue and revoke professional certificates." />;
