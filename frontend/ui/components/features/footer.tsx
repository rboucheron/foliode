import React from "react";

interface FooterProps {
  Image: (src: string, alt: string, className: string, width: number, height: number) => React.ReactNode;
  Link: (href: string, className: string, children: React.ReactNode) => React.ReactNode;
}

export function Footer({ Image, Link }: FooterProps) {
  const FoliodeLogo = ({ className }: { className?: string }) =>
    Image("/foliode-icon.svg", "logo foliode", className ?? "", 25, 25);

  return (
    <footer className="py-12 mt-32">
      <div className="mx-auto container max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4 px-10">
          {Link(
            "#",
            "flex items-center gap-2",
            <>
              <FoliodeLogo className="h-6 w-6" />
              <p className="text-26 font-normal">Foliode</p>
            </>
          )}
          <p className="text-muted-foreground">
            Le projet Foliode développe une solution pour les étudiants et enseignants de formations BUT. Il permet de créer et personnaliser un portfolio web, mettant en avant les compétences et projets des étudiants.
          </p>
        </div>
        <div className="grid gap-2 px-10">
          <h3 className="text-lg font-medium">Navigation</h3>
          <nav className="grid gap-1">
            {Link("#", "hover:underline", "Home")}
            {Link("#", "hover:underline", "About")}
            {Link("#", "hover:underline", "Products")}
            {Link("#", "hover:underline", "Contact")}
          </nav>
        </div>
        <div className="grid gap-2 px-10">
          <h3 className="text-lg font-medium">Resources</h3>
          <nav className="grid gap-1">
            {Link("#", "hover:underline", "Blog")}
            {Link("#", "hover:underline", "Documentation")}
            {Link("#", "hover:underline", "FAQ")}
          </nav>
        </div>
        <div className="grid gap-2 px-10">
          <h3 className="text-lg font-medium">Legal</h3>
          <nav className="grid gap-1">
            {Link("#", "hover:underline", "Terms of Service")}
            {Link("#", "hover:underline", "Privacy Policy")}
            {Link("#", "hover:underline", "Cookie Policy")}
          </nav>
        </div>
      </div>
      <div className="mx-auto container max-w-7xl mt-12 border-t pt-6 text-sm text-muted-foreground px-10">
        <p>&copy; 2024 Foliode Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
