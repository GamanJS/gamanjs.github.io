import React, { useState, useEffect } from "react";
import { Home, Route, Code2, Cog, Shield, Bug } from "lucide-react";

type Section = "Entry" | "Router" | "Controller" | "Service" | "Middleware" | "ExceptionHandler";

interface FileMap {
  file: string;
  lang: string;
  code: string;
  title: string;
  desc: string;
}

const FILES: Record<Section, FileMap> = {
  Entry: {
    file: "src/index.ts",
    lang: "ts",
    title: "Project Entry",
    desc: "Orchestrate your entire application using `defineBootstrap`.",
    code: `import { defineBootstrap } from 'gaman';
import AppRouter from './modules/app/AppRouter';
import { Cors } from "@gaman/cors";

defineBootstrap(async (app) => {
  app.mount(Cors());
  
  // Mount your feature routes
  app.mount(AppRouter);

  // Start the engine
  app.mountServer({ http: 3431 });
});`,
  },
  Router: {
    file: "src/modules/app/AppRouter.ts",
    lang: "ts",
    title: "Modular Routing",
    desc: "Define clean, traceable routes within your feature modules.",
    code: `import { composeRouter } from 'gaman/compose';
import AppController from './controllers/AppController';
import { AppService } from './services/AppService';
import AppMiddleware from './middlewares/AppMiddleware';
import { UserRouter } from "../user/UserRouter";
import { AuthRouter } from "../auth/AuthRouter";

export default composeRouter((r) => {
  r.mountService({
    appService: AppService()
  })
    .mountMiddleware(AppMiddleware);

  r.get('/', [AppController, 'HelloWorld']);
  
  
  /**
   * Mount your feature routes
   * modules/
   *  ├── auth/
   *  │   ├── controllers/*
   *  │   ├── services/*
   *  │   └── AuthRouter.ts
   *  ├── user/
   *  │   ├── controllers/*
   *  │   ├── services/*
   *  │   └── UserRouter.ts
   *  └── ...
   */
  r.mountRouter(UserRouter);
  r.mountRouter(AuthRouter);
});`,
  },
  Controller: {
    file: "src/modules/app/controllers/AppController.ts",
    lang: "ts",
    title: "Logic Controller",
    desc: "Handle requests using the fluent ctx.send() API and type-safe DI.",
    code: `import { composeController } from 'gaman/compose';
import { AppService } from '../services/AppService';

export type Deps = {
  appService: AppService;
}

export default composeController(({ appService }: Deps) => {
  // todo your private logic
  
  return {
    HelloWorld(ctx) {
      const message = appService.WelcomeMessage();
      return ctx.send(message).ok();
    },
  }
});`,
  },
  Service: {
    file: "src/modules/app/services/AppService.ts",
    lang: "ts",
    title: "Stateless Service",
    desc: "Pure business logic, isolated from the transport layer.",
    code: `import { composeService } from 'gaman/compose';

export const AppService = composeService(() => {
  // todo your private logic
    
  return {
    WelcomeMessage() {
      return '❤️ Built with GamanJS';
    },
  }
});

export type AppService = ReturnType<typeof AppService>;`,
  },
  Middleware: {
    file: "src/modules/app/middlewares/AppMiddleware.ts",
    lang: "ts",
    title: "Middleware",
    desc: "Intercept and augment the request context seamlessly.",
    code: `import { composeMiddleware } from 'gaman/compose';

export default composeMiddleware(async (ctx, next) => {
  ctx.set('trace_id', crypto.randomUUID());
  return next();
});`,
  },
  ExceptionHandler: {
    file: "GlobalException.ts",
    lang: "ts",
    title: "Global Exception",
    desc: "Centralized error handling with full context access.",
    code: `import { composeException } from 'gaman/compose';

export default composeException((error, ctx) => {
  return ctx.send({
    error: error.message,
    status: 500
  }).internalServerError();
});`,
  }
};

const ICONS: Record<Section, any> = {
  Entry: Home,
  Router: Route,
  Controller: Code2,
  Service: Cog,
  Middleware: Shield,
  ExceptionHandler: Bug
};

export default function CodeTabs() {
  const [active, setActive] = useState<Section>("Entry");
  const [highlighted, setHighlighted] = useState("");

  useEffect(() => {
    const { code, lang } = FILES[active];
     // @ts-ignore
    import("https://cdn.jsdelivr.net/npm/shiki@3.13.0/+esm")
    .then(async (shiki) => {
      const html = await shiki.codeToHtml(code, {
        lang,
        theme: "dracula", 
      });
      const clean = html.replace(/background-color:[^;"]+;?/g, "");
      setHighlighted(clean);
    })
    .catch((err) => {
      console.error("Shiki load error:", err);
      setHighlighted(`<pre>${code}</pre>`);
    });
  }, [active]);

  const { title, desc } = FILES[active];
  const Icon = ICONS[active];

  return (
    <div className="relative w-full md:max-w-6xl mx-auto my-12 rounded-2xl overflow-hidden glass-morphism shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 backdrop-blur-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row min-h-[500px]">
        {/* Left Sidebar Tabs */}
        <div className="w-full md:w-64 bg-stone-900/40 border-r border-white/5 p-4 space-y-2">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 px-2">Components</div>
          {(Object.keys(FILES) as Section[]).map((key) => {
            const TabIcon = ICONS[key];
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-300 font-medium ${
                  active === key
                    ? "bg-blue-500/20 text-blue-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-blue-500/20"
                    : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
                }`}
              >
                <TabIcon size={18} className={active === key ? "text-blue-400" : "text-stone-500"} />
                <span>{key === "ExceptionHandler" ? "Exception" : key}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-black/20">
          <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3 text-xl font-bold text-white mb-2">
              <Icon size={24} className="text-blue-400" />
              {title}
            </div>
            <p className="text-blue-100/60 font-medium">{desc}</p>
          </div>

          <div className="flex-1 relative group bg-stone-950/40">
            <div className="absolute top-4 right-6 z-20 flex items-center gap-3">
              <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-400">
                {FILES[active].file}
              </div>
              <button
                className="p-2 rounded-md bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition-colors"
                onClick={() => navigator.clipboard.writeText(FILES[active].code)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>

            <div
              className="px-8 py-6 font-mono text-[13px] md:text-sm leading-relaxed overflow-x-auto selection:bg-blue-500/30"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
