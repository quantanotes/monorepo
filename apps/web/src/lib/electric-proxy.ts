export async function proxyElectricRequest(
  req: Request,
  table: string,
  query: Record<string, string> = {},
) {
  const url = new URL(`${process.env.ELECTRIC_SQL_URL}/shape`);
  new URL(req.url).searchParams.forEach((value, key) => {
    if ([`live`, `handle`, `offset`, `cursor`].includes(key)) {
      url.searchParams.set(key, value);
    }
  });
  Object.entries(query).forEach(([key, value]) =>
    url.searchParams.append(key, value),
  );
  url.searchParams.set('table', table);
  url.searchParams.set('api_secret', process.env.ELECTRIC_SECRET!);
  let res = await fetch(url.toString());
  if (res.headers.get(`content-encoding`)) {
    const headers = new Headers(res.headers);
    headers.delete(`content-encoding`);
    headers.delete(`content-length`);
    headers.delete(`transfer-encoding`);
    res = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  }
  return res;
}
