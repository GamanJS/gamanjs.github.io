// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      allowedHosts: ["gaman.7togk.id", "gaman-docs.vercel.app", "gamanjs.github.io"],
    },
    plugins: [tailwindcss()],
  },
  site: "https://gaman.7togk.id",
  server: {
    port: 3521,
    host: "0.0.0.0",
  },
  output: "static",
  base: "/",
  integrations: [starlight({
    title: "Gaman Docs",
    favicon: "/public/img/new/3.png",
    locales: {
      root: { label: "EN", lang: "en", dir: "ltr" },
      id: { label: "ID", lang: "id", dir: "ltr" },
    },
    components: {
      PageSidebar: "./src/components/starlight/PageSidebar.astro",
      Header: "./src/components/starlight/Header.astro",
    },
    head: [
      {
        tag: "script",
        content: `
        document.documentElement.dataset.theme = 'dark';
        localStorage.setItem('starlight-theme', 'dark');
      `,
      },
    ],
    social: [
      {
        icon: "github",
        label: "Github",
        href: "https://github.com/7TogkID/gaman",
      },
      {
        icon: "comment",
        label: "WhatsApp",
        href: "https://whatsapp.com/channel/0029VbB0keR7z4kgczdSZ33s",
      },
    ],
    logo: {
      src: "/public/img/gaman-new-banner.png",
    },
    customCss: ["./src/styles/custom.css"],
    sidebar: [
      {
        label: "Introduction",
        link: "docs/index",
        slug: "docs",
      },
      {
        label: "Overview",
        badge: {
          text: "Baru",
          variant: "success",
        },
        items: [
          { label: "First Steps", link: "docs/overview/first-steps" },
          { label: "Bootstrap", link: "docs/overview/bootstrap" },
          { label: "Routing", link: "docs/overview/routing" },
          { label: "Controllers", link: "docs/overview/controllers" },
          {
            label: "Services",
            link: "docs/overview/services",
            badge: {
              text: "Baru",
              variant: "success",
            },
          },
          { label: "Responses", link: "docs/overview/responses" },
          { label: "Middlewares", link: "docs/overview/middlewares" },
          // { label: "Interceptors", link: "docs/overview/interceptors" },
          { label: "Exceptions", link: "docs/overview/exceptions" },
          // { label: "CLI", link: "docs/overview/cli" },
        ],
      },
      {
        label: "Technical",
        collapsed: true,
        items: [
          { label: "Context", link: "docs/technical/context" },
          // { label: "Session", link: "docs/technical/session" },
          { label: "Cookies", link: "docs/technical/cookies" },
          { label: "Logging", link: "docs/technical/logging" },
          // { label: "Static Serve", link: "docs/technical/static-serve" },
          // { label: "Text Format", link: "docs/technical/textformat" },
        ],
      },
      {
        label: "Security",
        collapsed: true,
        badge: {
          text: "Baru",
          variant: "success",
        },
        items: [
          { label: "CORS", link: "docs/security/cors" },
          // { label: "Basic Auth", link: "docs/security/basic-auth" },
          // {
          //   label: "Rate Limit",
          //   link: "docs/security/rate-limit",
          //   badge: {
          //     text: "Baru",
          //     variant: "success",
          //   },
          // },
          // {
          //   label: "JWT (Json Web Token)",
          //   link: "docs/security/jwt",
          //   badge: {
          //     text: "Baru",
          //     variant: "success",
          //   },
          // },
        ],
      },
      // {
      //   label: "View Engine",
      //   collapsed: true,
      //   badge: {
      //     text: "Baru",
      //     variant: "success",
      //   },
      //   items: [
      //     { label: "EJS", link: "docs/view-engine/ejs" },
      //     { label: "Nunjucks", link: "docs/view-engine/nunjucks" },
      //     {
      //       label: "Edge",
      //       link: "docs/view-engine/edge",
      //       badge: {
      //         text: "Baru",
      //         variant: "success",
      //       },
      //     },
      //   ],
      // },
      // {
      //   label: "Websocket",
      //   collapsed: true,
      //   items: [
      //     { label: "Internal", link: "docs/websocket/internal" },
      //     { label: "External", link: "docs/websocket/external" },
      //   ],
      // },
    ],
  }), sitemap(), react()],
});