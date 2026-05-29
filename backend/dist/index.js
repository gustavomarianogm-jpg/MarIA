"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const trpc_1 = require("./trpc");
const waitlist_1 = require("./routers/waitlist");
const user_1 = require("./routers/user");
const stories_1 = require("./routers/stories");
const chat_1 = require("./routers/chat");
const admin_1 = require("./routers/admin");
const matchmaking_1 = require("./routers/matchmaking");
const journalist_1 = require("./routers/journalist");
// Monta o appRouter AQUI, depois que todos os módulos já foram carregados
// Isso evita dependência circular (trpc.ts importava os routers que importavam trpc.ts)
exports.appRouter = (0, trpc_1.router)({
    healthcheck: trpc_1.publicProcedure.query(() => {
        return { status: 'ok', timestamp: new Date() };
    }),
    waitlist: waitlist_1.waitlistRouter,
    user: user_1.userRouter,
    stories: stories_1.storiesRouter,
    chat: chat_1.chatRouter,
    admin: admin_1.adminRouter,
    matchmaking: matchmaking_1.matchmakingRouter,
    journalist: journalist_1.journalistRouter,
});
const app = (0, express_1.default)();
// Permite chamadas do frontend no Vercel e do localhost
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://mar-ia-mhjz.vercel.app',
    process.env.ALLOWED_ORIGIN
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app')) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
// tRPC endpoint
app.use('/trpc', trpcExpress.createExpressMiddleware({
    router: exports.appRouter,
    createContext: trpc_1.createContext,
}));
app.get('/', (req, res) => {
    res.send('Backend MarIA executando (Express + tRPC)');
});
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
    });
}
// Exporta o app para o Vercel (Serverless)
exports.default = app;
