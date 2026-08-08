const UPSTREAM = 'https://fridge-chef-ai.vercel.app';

const H3_PLANE = `<svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 29.5 66 6 43 66 33.5 39.5 5 29.5Z" fill="#D7A52A"/><path d="M5 29.5 66 6 26.5 35.7 5 29.5Z" fill="#F2CE65"/><path d="M33.5 39.5 66 6 27 49.5 17 62 31 53.5 33.5 39.5Z" fill="#B98416"/><path d="M33.5 39.5 66 6 39.2 44.2 33.5 39.5Z" fill="#FFF0B5"/></svg>`;

const H3_STYLES = `<style id="h3works-brand-styles">
  .h3works-splash{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;background:#090909;color:#fff;overflow:hidden;transition:opacity .55s ease,visibility .55s ease}
  .h3works-splash::before{content:"";position:absolute;width:min(86vw,720px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(215,165,42,.14),rgba(215,165,42,0) 68%);filter:blur(6px);transform:scale(.72);animation:h3Glow 1.4s ease forwards}
  .h3works-splash__inner{position:relative;z-index:1;display:grid;justify-items:center;text-align:center;transform:translateY(12px) scale(.94);opacity:0;animation:h3Intro .7s cubic-bezier(.2,.7,.2,1) .08s forwards}
  .h3works-splash__mark{width:clamp(122px,26vw,220px);height:clamp(122px,26vw,220px);filter:drop-shadow(0 18px 50px rgba(215,165,42,.18))}
  .h3works-splash__mark svg{width:100%;height:100%;display:block}
  .h3works-splash__name{margin-top:12px;font:800 clamp(30px,6vw,56px)/1.05 Arial,sans-serif;letter-spacing:.08em}
  .h3works-splash__tag{margin-top:10px;font:700 10px/1.2 Arial,sans-serif;letter-spacing:.38em;color:#b9b1a2}
  .h3works-splash__present{margin-top:32px;font:500 12px/1.3 Arial,sans-serif;letter-spacing:.08em;color:#777}
  .h3works-splash__present b{color:#f5f1e9;font-size:14px}
  .h3works-splash.is-leaving{opacity:0;visibility:hidden}
  .h3-credit{display:inline-flex!important;align-items:center;gap:5px!important;margin-top:4px!important;color:#8a8178!important;font-family:Arial,sans-serif!important;font-size:9px!important;line-height:1!important;letter-spacing:.15px!important;text-transform:none!important;white-space:nowrap}
  .h3-credit svg{width:12px;height:12px;display:block;flex:0 0 auto}
  .h3-credit b{color:#5f574f;font-size:9px;font-weight:800;letter-spacing:.35px}
  .footer-h3-credit{display:inline-flex;align-items:center;gap:6px;margin-left:8px;color:#777;font-size:10px;white-space:nowrap}
  .footer-h3-credit svg{width:13px;height:13px}
  @keyframes h3Intro{to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes h3Glow{to{transform:scale(1)}}
  @media(max-width:560px){.h3works-splash__present{margin-top:24px}.h3-credit{font-size:8px!important}.h3-credit b{font-size:8px}}
  @media(prefers-reduced-motion:reduce){.h3works-splash,.h3works-splash__inner,.h3works-splash::before{animation:none!important;transition:none!important}.h3works-splash__inner{opacity:1;transform:none}}
</style>`;

const H3_SPLASH = `<div class="h3works-splash" id="h3worksSplash" aria-label="H3 WORKS"><div class="h3works-splash__inner"><div class="h3works-splash__mark">${H3_PLANE}</div><div class="h3works-splash__name">H3 WORKS</div><div class="h3works-splash__tag">MAKE. PLAY. EXPLORE.</div><div class="h3works-splash__present">presents <b>냉털셰프</b></div></div></div>`;

const H3_SCRIPT = `<script id="h3works-splash-script">(()=>{const splash=document.getElementById('h3worksSplash');if(!splash)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const leave=()=>{splash.classList.add('is-leaving');setTimeout(()=>splash.remove(),reduce?30:650)};setTimeout(leave,reduce?700:1450)})();</script>`;

function injectBrand(html) {
  let out = html;

  if (!out.includes('h3works-brand-styles')) {
    out = out.replace('</head>', `${H3_STYLES}</head>`);
  }

  out = out.replace(/<title>냉털셰프\s*\|/i, '<title>냉털셰프 by H3 WORKS |');
  out = out.replace(/<meta name="description" content="([^"]*)"\s*\/?>/i, '<meta name="description" content="$1 · by H3 WORKS" /><meta name="author" content="H3 WORKS" />');

  const brandNeedle = '<small>Fridge to Table</small>';
  if (out.includes(brandNeedle) && !out.includes('class="h3-credit"')) {
    out = out.replace(brandNeedle, `${brandNeedle}<span class="h3-credit" aria-label="H3 WORKS에서 제작">${H3_PLANE}<span>by <b>H3 WORKS</b></span></span>`);
  }

  if (!out.includes('id="h3worksSplash"')) {
    out = out.replace(/<body([^>]*)>/i, `<body$1>${H3_SPLASH}`);
  }

  if (!out.includes('id="h3works-splash-script"')) {
    out = out.replace('</body>', `${H3_SCRIPT}</body>`);
  }

  out = out.replace('© 2026 Fridge Chef. Built for leftovers with potential.', `© 2026 Fridge Chef · H3 WORKS. Built for leftovers with potential.`);

  return out;
}

function proxyRequest(request, targetUrl) {
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('x-h3works-proxy', 'fridge-chef');

  const init = {
    method: request.method,
    headers,
    redirect: 'manual'
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  return new Request(targetUrl, init);
}

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const target = new URL(incoming.pathname + incoming.search, UPSTREAM);

    const upstream = await fetch(proxyRequest(request, target.toString()));
    const contentType = upstream.headers.get('content-type') || '';

    if (!contentType.includes('text/html')) {
      return upstream;
    }

    const html = await upstream.text();
    const branded = injectBrand(html);
    const headers = new Headers(upstream.headers);
    headers.delete('content-length');
    headers.delete('content-encoding');
    headers.delete('content-security-policy');
    headers.delete('content-security-policy-report-only');
    headers.set('content-type', 'text/html; charset=utf-8');
    headers.set('cache-control', 'no-store');
    headers.set('x-powered-by', 'H3 WORKS');

    return new Response(branded, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers
    });
  }
};
