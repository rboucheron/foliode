import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n"

const DIAGONAL_LINES = Array.from({ length: 70 }, (_, index) => index)

function HatchedColumn({ className }: { className?: string }) {
  return (
    <div className={`relative justify-between gap-[118px] overflow-hidden lg:flex ${className ?? ""}`}>
      <hr className="z-10 h-screen w-px bg-[#2F7678] opacity-50" />
      <div className="absolute -left-44 flex w-full flex-col justify-between gap-3">
        {DIAGONAL_LINES.map((index) => (
          <hr key={index} className="h-px w-[400px] -rotate-[31.36deg] border border-[#2F7678] opacity-50" />
        ))}
      </div>
      <hr className="z-10 h-screen w-px bg-[#2F7678] opacity-50" />
    </div>
  )
}

const BLOB_BASE = "absolute hidden rounded-[50%] opacity-50 blur-[90px] z-4 sm:block"

export function LandingHero() {
  const t = useTranslation()
  return (
    <>
      <section className="relative h-[700px]" id="accueil">
        <hr className="h-px w-full" />
        <div className="absolute w-full overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="relative flex justify-between overflow-hidden">
            <HatchedColumn className="z-10" />
            <hr className="absolute right-[314px] z-10 hidden h-full w-px border border-[#2F7678] opacity-50 lg:block 2xl:right-52" />
            <hr className="absolute left-[337px] z-10 hidden h-full w-px border border-[#2F7678] opacity-50 lg:block 2xl:left-52" />
            <hr className="absolute top-[271px] left-0 z-0 h-px w-full border-[#2F7678] opacity-50" />
            <hr className="absolute top-[365px] left-0 z-0 h-px w-full border-[#2F7678] opacity-50" />
            <hr className="absolute top-[538px] left-0 z-0 h-px w-full border-dashed border-[#2F7678] bg-transparent opacity-50" />
            <div className="absolute left-0 h-full w-full">
              <div className="mx-0 -mt-[531px] mb-0 h-[1681px] rounded-[100%] border border-[#19262F] bg-linear-to-t from-[#1F435C] from-10% via-[#1F435C] to-[#16252F] to-60% opacity-50 lg:mx-[120px]" />
              <div className="-mt-[845px] h-[601px] rounded-[100%] border border-[#19262F] bg-linear-to-t from-[#172937] from-10% via-[#172937] to-[#142936] to-60% opacity-50 md:h-[1531px] lg:mx-[120px]" />
            </div>
            <HatchedColumn className="z-10" />
          </div>
        </div>

        <div className="absolute z-10 mt-20 w-full px-6 text-center">
          <h1 className="mx-auto max-w-[992px] text-[40px] leading-[40px] font-medium text-foreground sm:text-[50px] sm:leading-[50px] md:text-[65px] md:leading-[65px] lg:text-[80px] lg:leading-[80px] xl:text-[94px] xl:leading-[90px]">
            {t("landing.hero.title")}
          </h1>
          <p className="mx-auto mt-10 max-w-lg text-16 font-normal text-foreground">
            {t("landing.hero.subtitle")}
          </p>
          <Button asChild size="lg" className="mt-20 rounded-full">
            <a href="#avantages">{t("landing.hero.cta")}</a>
          </Button>
        </div>

        <div className={`${BLOB_BASE} -top-[104px] left-[181px] h-[250px] w-[300px] bg-[#2B4557] sm:h-[350px] sm:w-[400px] md:h-[413px] md:w-2/5`} />
        <div className={`${BLOB_BASE} -top-[120px] right-[275px] h-[350px] w-[300px] bg-[#2F5E73] sm:h-[400px] sm:w-[350px] md:h-[486px] md:w-[423px]`} />
        <div className={`${BLOB_BASE} top-[337px] left-[228px] h-[250px] w-[200px] bg-[#184254] sm:h-[300px] sm:w-[220px] md:h-[339px] md:w-[236px]`} />
        <div className={`${BLOB_BASE} top-[242px] right-[231px] h-[300px] w-[100px] bg-[#2B4557] sm:h-[350px] sm:w-[115px] md:h-[414px] md:w-[129px]`} />
        <div className={`${BLOB_BASE} top-[385px] right-1/2 left-1/2 h-[150px] w-[300px] -translate-x-1/2 translate-y-1/2 bg-[#3c607a] sm:h-[180px] sm:w-[500px] md:h-[200px] md:w-[700px] lg:h-[220px] lg:w-[850px] xl:h-[253px] xl:w-[995px]`} />
        <div className={`${BLOB_BASE} right-1/2 left-1/2 h-[200px] w-[200px] -translate-x-1/2 translate-y-1/2 bg-[#41657f] sm:h-[250px] sm:w-[250px] md:h-[297px] md:w-[334px]`} />
        <div className={`${BLOB_BASE} right-1/2 left-1/2 h-[180px] w-[200px] -translate-x-[90%] -translate-y-1/2 bg-[#2B4557] sm:h-[200px] sm:w-[240px] md:h-[220px] md:w-[272px]`} />
      </section>
      <div>
        <img
          src="/Dashboard.png"
          alt={t("landing.hero.dashboardAlt")}
          width={1640}
          height={300}
          fetchPriority="high"
          className="relative z-40 mx-auto -mt-52 w-10/12 rounded-3xl border-8 border-[#2B4557] lg:mt-0 lg:border-[26px]"
        />
      </div>
    </>
  )
}
