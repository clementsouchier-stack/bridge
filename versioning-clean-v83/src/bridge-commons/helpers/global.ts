export const camelize = (s:string) => String(s||"").trim().replace(/[^a-zA-Z0-9]+(.)/g,(_,c)=>c.toUpperCase());
