/* eslint-disable @cspell/spellchecker */
/* eslint-disable unicorn/prevent-abbreviations */
export const allowCors =
  (fn, origin = "*") =>
  async (req, res) => {
    console.log({ origin: req.headers.origin });
    res.setHeader("Cache-Control", "s-maxage=86400");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return await fn(req, res);
  };
