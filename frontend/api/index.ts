/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function handler(req: any, res: any) {
  try {
    const appModule = await import('../backend/dist/index.js');
    const app = appModule.default?.default || appModule.default || appModule;

    if (typeof app !== 'function') {
      throw new Error(
        `Imported app is not a function. Type: ${typeof app}, Keys: ${Object.keys(app || {})}`
      );
    }

    return app(req, res);
  } catch (error: any) {
    res.status(500).json({
      error: 'Vercel Function Startup Error',
      message: error.message,
      stack: error.stack,
    });
  }
}
