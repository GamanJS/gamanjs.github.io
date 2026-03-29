import Box from "../icons/box.astro";
import Broadcast from "../icons/broadcast.astro";
import Code from "../icons/code.astro";
import Coludcross from "../icons/coludcross.astro";
import Documentcode from "../icons/documentcode.astro";
import Electric from "../icons/electric.astro";
import Request from "../icons/request.astro";
import Secure from "../icons/secure.astro";
import Securityuser from "../icons/securityuser.astro";

// Navbar Section
export const navbar = {
  links: [
    {
      label: "Docs",
      url: "/docs",
    },
    {
      label: "Blogs",
      url: "/blogs",
    },
  ],
};

// Feature Section
export const features = {
  description:
    "A framework designed for the long game. Build on a foundation of speed, logic, and absolute type safety.",
  items: [
    {
      icon: Code,
      title: "TypeScript First",
      text: "End-to-end type safety out of the box.",
    },
    {
      icon: Secure,
      title: "Secure by Default",
      text: "Built-in middleware and best practices.",
    },
    {
      icon: Box,
      title: "Enterprise Ready",
      text: "Engineered to handle complex business logic and massive traffic with ease.",
    },
    // {
    //   icon: Code1,
    //   title: "Developer Friendly",
    //   text: "Simple, minimal, and powerful API.",
    // },
    {
      icon: Electric,
      title: "Plugin System",
      text: "Extend and customize with ease.",
    },
  ],
};

// Plugin Section
export const plugins = {
  description:
    "GamanJS ecosystem is modular. Add only what you need, keeping your production footprint minimal.",
  items: [
    {
      icon: Secure,
      title: "Auth",
      text: "Protect routes using simple HTTP user authentication",
    },
    {
      icon: Securityuser,
      title: "Session",
      text: "Cookie based login system for persistent user sessions",
    },
    {
      icon: Broadcast,
      title: "Web Socket",
      text: "Build real-time features with event-based channels",
    },

    {
      icon: Coludcross,
      title: "CORS",
      text: "Secure cross-origin access without manual header configs",
    },
    {
      icon: Request,
      title: "Limiter",
      text: "Limits how many requests a client can make in a set timeframe.",
    },

    {
      icon: Documentcode,
      title: "View Engine",
      text: "Render dynamic pages with your preferred template engine",
    },
  ],
};

// Footer
const date = new Date();
export const footer = {
  title: `© ${date.getFullYear()} GamanJS. All rights reserved.`,
  documents: {
    title: "Documentation",
    links: [
      {
        label: "Getting Started",
        url: "docs/overview/first-steps",
      },
      {
        label: "Routing",
        url: "docs/overview/routing",
      },
      {
        label: "Controllers",
        url: "docs/overview/controllers",
      },
      {
        label: "Middlewares",
        url: "docs/overview/middlewares",
      },
      {
        label: "Interceptors",
        url: "docs/overview/interceptors",
      },
    ],
  },
  community: {
    title: "Community",
    links: [
      {
        label: "Github",
        url: "https://github.com/7TogkID/gaman",
      },
      {
        label: "Discord",
        url: "https://discord.gg/CQ6fEqBe8f",
      },
      {
        label: "Whatsapp",
        url: "https://whatsapp.com/channel/0029VbB0keR7z4kgczdSZ33s",
      },
    ],
  },
  resource: {
    title: "Resources",
    links: [
      {
        label: "About",
        url: "#",
      },
      {
        label: "Blog",
        url: "/blogs",
      },
      {
        label: "Brand Guidelines",
        url: "#",
      },
    ],
  },
  links: [
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: "Terms of Service",
      href: "/terms-of-service",
    },
  ],
};
