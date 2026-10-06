import { useEffect } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://immiq.onrender.com/api/v1";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function SEO({
  title,
  description,
  image,
}: SEOProps) {
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const response = await fetch(
          `${API_URL}/settings/public`
        );

        const result = await response.json();

        if (!result.success) return;

        const settings = result.data;

        const finalTitle =
          title ||
          settings.seoTitle ||
          "IMMIQ | Curiosity First. Technology Next.";

        const finalDescription =
          description ||
          settings.seoDescription ||
          "IMMIQ is a technology company focused on corporate training, SaaS development, emerging technologies and digital services.";

        const finalImage =
          image ||
          settings.ogImage ||
          "";

        document.title = finalTitle;

        setMeta(
          "description",
          finalDescription
        );

        if (settings.seoKeywords) {
          setMeta(
            "keywords",
            settings.seoKeywords
          );
        }

        setMeta(
          "og:title",
          finalTitle,
          true
        );

        setMeta(
          "og:description",
          finalDescription,
          true
        );

        if (finalImage) {
          setMeta(
            "og:image",
            finalImage,
            true
          );
        }

        setMeta(
          "og:type",
          "website",
          true
        );

        setMeta(
          "twitter:card",
          "summary_large_image"
        );

        setMeta(
          "twitter:title",
          finalTitle
        );

        setMeta(
          "twitter:description",
          finalDescription
        );

        if (finalImage) {
          setMeta(
            "twitter:image",
            finalImage
          );
        }

        setCanonical();
      } catch (error) {
        console.error(
          "SEO loading failed:",
          error
        );
      }
    };

    loadSEO();
  }, [title, description, image]);

  return null;
}

function setMeta(
  name: string,
  content: string,
  property = false
) {
  const attribute = property
    ? "property"
    : "name";

  let element = document.head.querySelector(
    `meta[${attribute}="${name}"]`
  ) as HTMLMetaElement | null;

  if (!element) {
    element =
      document.createElement("meta");

    element.setAttribute(
      attribute,
      name
    );

    document.head.appendChild(element);
  }

  element.setAttribute(
    "content",
    content
  );
}

function setCanonical() {
  const existing =
    document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

  const canonical =
    existing ||
    document.createElement("link");

  canonical.rel = "canonical";
  canonical.href =
    window.location.origin +
    window.location.pathname;

  if (!existing) {
    document.head.appendChild(
      canonical
    );
  }
}