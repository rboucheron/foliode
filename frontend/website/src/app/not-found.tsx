import { ModelViewer404 as ModelViewer } from "@/shared/media";
import Image from "next/image";
import Link from "next/link";

export default function Error_404() {
  return (
    <div>
      <div className="flex justify-center mt-6">
        <Image
          src="/foliode-icon.svg"
          alt="logo foliode"
          width={75}
          height={75}
        />
      </div>
      <div className="flex items-center justify-center ">
        <ModelViewer />
        <div className="flex flex-col ">
          <h1 className="text-5xl font-bold">Oups !</h1> <br />
          <h2 className="text-3xl font-bold">
            404 - La page n'est pas trouvée{" "}
          </h2>
          <p className="mt-2">
            La page que vous recherchez a peut-être été supprimée ou est
            temporairement indisponible.
          </p>
          <div className="flex justify-left">
            <Link
              href="/"
              className="text-20 mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
            >
              Revenir sur la page Foliode
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}