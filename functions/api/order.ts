const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyOsTHVz9_mG0W9mPAKMjhjP92ypAtyQfj6qXmF_VKZRN5QSYvmo60LdYvmOh-lrNOotw/exec';

interface OrderEnv {
  ORDER_FORM_SECRET: string;
}

export const onRequestPost: PagesFunction<OrderEnv> = async ({ request, env }) => {
  try {
    const payload = await request.json();
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: env.ORDER_FORM_SECRET, ...(payload as object) }),
    });

    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ status: 'error', message: 'Invalid response from order backend' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: 'error', message: err instanceof Error ? err.message : 'Unknown server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
