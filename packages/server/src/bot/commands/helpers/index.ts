// export * from './_deployCommands';
// export * from './_commandState';

export const jsonBlock = (jsonString: any): string => `
\`\`\`json
${JSON.stringify(jsonString, null, 2)}
\`\`\`
    `;
