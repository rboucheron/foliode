import { LandingAdvantages } from "./landing-advantages"
import { LandingEvaluation } from "./landing-evaluation"
import { LandingFeatures } from "./landing-features"
import { LandingFooter } from "./landing-footer"
import { LandingHero } from "./landing-hero"
import { LandingNav } from "./landing-nav"

export function LandingPage() {
  return (
    <div className="min-h-svh overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <LandingAdvantages />
      <LandingFeatures />
      <LandingEvaluation />
      <LandingFooter />
    </div>
  )
}
