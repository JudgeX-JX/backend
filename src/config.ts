import clrs from 'colors';

const requiredEnv = [
  'MONGODB_URL',
  'JWT_SECRET_KEY',
  'EMAIL',
  'EMAIL_PASSWORD',
  'CF_SUBMITTER_URL',
  'CF_SUBMITTER_API_KEY',
  'CF_PROBLEM_SCRAPPER_URL',
];

export function check(): void {
  const unsetEnv = requiredEnv.filter((env) => process.env[env] === undefined);
  if (unsetEnv.length > 0) {
    const errMsg = clrs.red(
      `🤨 Required env variables are not set: [${clrs.yellow(
        unsetEnv.join(', '.red),
      )}]`,
    );
    throw new Error(errMsg);
  }
  console.info(clrs.green(`🤟 Configuration`));
}
