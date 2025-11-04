export function placeholderSvg(label: string) {
  const text = encodeURIComponent((label || "Image").slice(0, 24));
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
        <defs>
          <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop stop-color='#e5e7eb' offset='0'/>
            <stop stop-color='#f1f5f9' offset='1'/>
          </linearGradient>
        </defs>
        <rect width='100%' height='100%' fill='url(#g)'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
          font-family='system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial'
          font-size='36' fill='#475569'>${text}</text>
      </svg>
    `)
  );
}
