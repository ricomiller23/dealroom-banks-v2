export async function POST(req: Request) {
  try {
    const b = await req.json();
    const ref = String(b.ref || "").slice(0, 40).replace(/[^\w-]/g, "");
    const path = String(b.path || "").slice(0, 120);
    if (ref) console.log(JSON.stringify({ kind: "dealroom_visit", ref, path, ts: new Date().toISOString() }));
  } catch {}
  return new Response(null, { status: 204 });
}
