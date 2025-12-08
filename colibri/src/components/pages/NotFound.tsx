import { Container } from "@/components/utils/Container";
import { FadeIn } from "../utils/fade-in";

export default function NotFoundPage() {
  return (
    <Container className="flex h-full items-center pt-24 sm:pt-32 lg:pt-40">
      <FadeIn className="flex max-w-xl flex-col items-center text-center">
        <h1 className="mt-4 font-display text-2xl font-semibold text-neutral-950">
          Page introuvable
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Veuillez vérifier l&apos;URL ou retourner à la page d&apos;accueil.
        </p>
        {/* <Link
          href="/"
          className="mt-4 text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
        >
          Go to the home page
        </Link> */}
      </FadeIn>
    </Container>
  );
}
