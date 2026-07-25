import { ReactNode } from "react";
import { Portfolio } from "@rboucheron/types";
import { Card } from "@heroui/react";

interface BantoFlowProps {
    portfolio: Portfolio;
    commentsSection?: ReactNode;
    Image: (src: string, alt: string, className: string, width: number, height: number) => ReactNode;
    Link: (href: string, className: string, children: ReactNode) => ReactNode;
    formatImage: (src: string) => string;
    generateAvatar: (size: number, seed: string) => string;
}

function BantoFlow({ portfolio, commentsSection, Image, Link, formatImage, generateAvatar }: BantoFlowProps) {
    const { primary, secondary, light } = portfolio.config.colors;
    const avatar = portfolio.users.avatar_url;

    return (
        <div
            className="bg-gradient-to-br min-h-screen font-sans p-8"
            style={{
                background: `linear-gradient(to bottom right, ${light}, ${primary})`,
            }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 2xl:w-3/4 xl:w-5/6 m-auto">
                <Card
                    className="shadow-xl rounded-xl overflow-hidden col-span-2"
                    style={{ backgroundColor: secondary }}
                >
                    <div className="p-6" style={{ backgroundColor: primary }}>
                        <h1
                            className="text-4xl font-bold mb-2 transition-colors duration-300"
                            style={{ color: secondary }}
                        >
                            {portfolio.title}
                        </h1>
                        <h3
                            className="text-xl transition-colors duration-300"
                            style={{ color: secondary }}
                        >
                            {portfolio.subtitle}
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div className="w-full flex justify-center">
                                {Image(
                                    avatar ? formatImage(avatar) : generateAvatar(250, portfolio.users.email),
                                    portfolio.title,
                                    "rounded-lg object-cover",
                                    250,
                                    250
                                )}
                            </div>
                            <p
                                className="text-lg col-span-2 leading-relaxed p-4"
                                style={{ color: light }}
                            >
                                {portfolio.bio}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card
                    className="shadow-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
                    style={{ backgroundColor: secondary }}
                >
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4" style={{ color: light }}>
                            Compétences
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {portfolio.tools.map((tool, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center space-y-2 p-3"
                                >
                                    {Image(formatImage(tool.picto), "", "rounded-sm", 40, 40)}
                                    <p
                                        className="text-sm font-semibold text-center"
                                        style={{ color: light }}
                                    >
                                        {tool.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {portfolio.projects.map((project, index) => (
                    <div key={index}>
                        {Link(
                            `/${portfolio.url}/project/${project.title}`,
                            "",
                            <Card
                                className={`shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer ${index == 3 && "col-span-2 row-span-2"
                                    }`}
                                style={{ backgroundColor: light, color: primary }}
                            >
                                <div className="flex flex-col h-full justify-between">
                                    {project.projectsImages && project.projectsImages.length !== 0
                                        ? Image(
                                            formatImage(project.projectsImages[0].img_src),
                                            "",
                                            "object-cover rounded-none w-full h-28",
                                            1000,
                                            250
                                        )
                                        : ""}

                                    <div className="p-4">
                                        <h3
                                            className="text-2xl first-letter:uppercase font-bold mb-4"
                                            style={{ color: secondary }}
                                        >
                                            {project.title}
                                        </h3>
                                        <p className="text-sm mb-4 line-clamp-2" style={{ color: secondary }}>
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                ))}
            </div>

            {commentsSection}
        </div>
    );
}

export default BantoFlow;
