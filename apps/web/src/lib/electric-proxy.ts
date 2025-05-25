export async function proxyElectricRequest(
  req: Request,
  table: string,
  query: Record<string, string> = {},
) {
  const url = new URL(`https://api.electric-sql.cloud/v1/shape`);

  new URL(req.url).searchParams.forEach((value, key) => {
    if ([`live`, `handle`, `offset`, `cursor`, 'columns'].includes(key)) {
      url.searchParams.set(key, value);
    }
  });

  Object.entries(query).forEach(([key, value]) =>
    url.searchParams.append(key, value),
  );

  url.searchParams.set('table', table);
  url.searchParams.set('source_id', process.env.ELECTRIC_ID!);
  url.searchParams.set('source_secret', process.env.ELECTRIC_SECRET!);

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
