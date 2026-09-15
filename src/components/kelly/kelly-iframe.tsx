import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const VALID_PAGES = [
  "home",
  "notes",
  "subjects",
  "study",
  "quizzes",
  "flashcards",
  "groups",
  "calendar",
  "progress",
  "profile",
] as const;

type KellyPage = (typeof VALID_PAGES)[number];

function pathToPage(pathname: string): KellyPage {
  const page = pathname.replace(/^\/+/, "");

  if (page === "" || page === "home") {
    return "home";
  }

  if ((VALID_PAGES as readonly string[]).includes(page)) {
    return page as KellyPage;
  }

  return "home";
}

export function KellyIframe() {
  const location = useLocation();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const page = pathToPage(location.pathname);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    const sendPage = () => {
      iframe.contentWindow?.postMessage(
        {
          type: "kelly:set-page",
          page,
        },
        window.location.origin,
      );
    };

    iframe.addEventListener("load", sendPage);
    sendPage();

    return () => {
      iframe.removeEventListener("load", sendPage);
    };
  }, [page]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const data = event.data;

      if (data?.type !== "kelly:request-navigation") {
        return;
      }

      const requestedPage = data.page;

      if (
        typeof requestedPage !== "string" ||
        !(VALID_PAGES as readonly string[]).includes(requestedPage)
      ) {
        return;
      }

      const targetPath =
        requestedPage === "home"
          ? "/home"
          : `/${requestedPage}`;

      if (location.pathname !== targetPath) {
        navigate({
          to: targetPath,
        });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [location.pathname, navigate]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#0a0a0f",
      }}
    >
      <iframe
        ref={iframeRef}
        src="/KELLY/KELLY.html"
        title="Kelly"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
