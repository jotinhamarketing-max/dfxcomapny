import crypto from "crypto";

const PIXEL_ID = "750643444150508";

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function hashPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  return hash(normalized);
}

interface UserData {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
}

interface CAPIEvent {
  event_name: string;
  event_time: number;
  action_source: "website";
  event_source_url?: string;
  event_id?: string;
  user_data?: UserData;
  custom_data?: Record<string, unknown>;
}

export async function sendCAPIEvent(event: CAPIEvent): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event], access_token: token }),
    });
  } catch {
    // CAPI failure must not break the main flow
  }
}

export function buildLeadEvent({
  email,
  phone,
  name,
  url,
  eventId,
  ip,
  userAgent,
  fbc,
  fbp,
}: {
  email?: string;
  phone?: string;
  name?: string;
  url?: string;
  eventId?: string;
  ip?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}): CAPIEvent {
  const nameParts = (name ?? "").trim().split(/\s+/);

  const userData: UserData = {
    ...(email ? { em: hash(email) } : {}),
    ...(phone ? { ph: hashPhone(phone) } : {}),
    ...(nameParts[0] ? { fn: hash(nameParts[0]) } : {}),
    ...(nameParts[1] ? { ln: hash(nameParts[nameParts.length - 1]) } : {}),
    ...(ip ? { client_ip_address: ip } : {}),
    ...(userAgent ? { client_user_agent: userAgent } : {}),
    ...(fbc ? { fbc } : {}),
    ...(fbp ? { fbp } : {}),
  };

  return {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: url ?? "https://dfcompany.com.br/contato",
    event_id: eventId ?? `lead_${Date.now()}`,
    user_data: userData,
    custom_data: { content_name: "Diagnóstico Estratégico" },
  };
}
