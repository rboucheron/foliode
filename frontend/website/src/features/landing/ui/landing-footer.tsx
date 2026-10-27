const footerSections = [
  { title: "Navigation", links: ["Home", "About", "Products", "Contact"] },
  { title: "Resources", links: ["Blog", "Documentation", "FAQ"] },
  { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Cookie Policy"] },
] as const

export function LandingFooter() {
  return (
    <footer className="mt-32 py-12">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 px-10">
          <a href="#" className="flex items-center gap-2">
            <img src="/foliode-icon.svg" alt="logo foliode" width={25} height={25} className="h-6 w-6" />
            <p className="text-26 font-normal">Foliode</p>
          </a>
          <p className="text-muted-foreground">
            Le projet Foliode développe une solution pour les étudiants et enseignants de formations BUT. Il permet de
            créer et personnaliser un portfolio web, mettant en avant les compétences et projets des étudiants.
          </p>
        </div>
        {footerSections.map((section) => (
          <div key={section.title} className="grid gap-2 px-10">
            <h3 className="text-lg font-medium">{section.title}</h3>
            <nav className="grid gap-1">
              {section.links.map((label) => (
                <a key={label} href="#" className="hover:underline">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </div>
      <div className="container mx-auto mt-12 max-w-7xl border-t px-10 pt-6 text-sm text-muted-foreground">
        <p>&copy; 2024 Foliode Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}
