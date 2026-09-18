import { Suspense } from "react";
import PdfViewerClient from "@/components/PdfViewerClient";
import { getProjectBySlug } from "@/data/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return {
    title: project?.title || "Dokumen",
  };
}

export default async function PdfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.pdfFile) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-muted text-sm">
        Dokumen tidak ditemukan.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center text-muted text-sm">
          Memuat dokumen...
        </div>
      }
    >
      <PdfViewerClient
        file={project.pdfFile}
        title={project.title}
        downloadFile={project.downloadFile || project.pdfFile}
      />
    </Suspense>
  );
}
