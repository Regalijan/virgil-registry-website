export default function (body: { [k: string]: any }, status: number) {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
    },
    status,
  });
}
