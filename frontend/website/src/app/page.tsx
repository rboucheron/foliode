import styles       from "./page.module.css";
import { Nav } from "@/shared/shell";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <Nav/>
      <main className="overflow-hidden">
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(47,94,115,0.22),_transparent_45%),linear-gradient(180deg,_#081018_0%,_#0d1720_45%,_#f7f5f2_100%)]" />
          <div className="max-w-4xl space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Portfolio DDD</p>
            <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
              Transformez vos projets en portfolio professionnel.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-300 md:text-lg">
              Une base moderne pour présenter vos compétences, vos projets et votre progression avec une architecture métier claire.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Link href="/signup" className="rounded-full bg-primary px-6 py-3 font-medium text-white transition-opacity hover:opacity-90">
                Commencer
              </Link>
              <Link href="#features" className="rounded-full border border-white/20 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10">
                Découvrir
              </Link>
            </div>
          </div>
          <div className="mt-12 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
            <Image
              src="/Dashboard.png"
              alt="Dashboard Foliode"
              width={1640}
              height={300}
              className="h-auto w-full"
              priority
            />
          </div>
        </section>

        <section id="features" className="grid gap-6 px-6 py-20 md:grid-cols-3">
          {[
            ["Structuration métier", "Chaque domaine vit dans sa propre couche d'application, de domaine et d'UI."],
            ["Design system unique", "L'interface s'appuie sur les packages internes du monorepo pour conserver une cohérence forte."],
            ["Évolutif", "Le code est prêt pour faire évoluer l'onboarding, les projets et la gestion des commentaires."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
            </article>
          ))}
        </section>

        <section className="px-6 pb-20">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-[#0f172a]">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Une base propre pour un portfolio moderne</h2>
            <p className="mx-auto mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
              La navigation, l'authentification, les projets, les compétences et les commentaires restent fonctionnels tout en étant réorganisés autour des domaines métier.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
