import HeroForm from "@/components/Admin/HeroForm";
import { db } from "@/lib/db";

export default async function AdminHeroPage() {
  const heroData = await db.heroContent.findFirst();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        Edit Hero Section
      </h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <HeroForm initialData={heroData} />
      </div>

    </div>
  );
}