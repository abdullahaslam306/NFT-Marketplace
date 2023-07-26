export const ConfigureAmazonCloudWatch = {
  dev: `(function (n, i, v, r, s, c, x, z) {
    x = window.AwsRumClient = { q: [], n: n, i: i, v: v, r: r, c: c };
    window[n] = function (c, p) {
      x.q.push({ c: c, p: p });
    };
    z = document.createElement("script");
    z.async = true;
    z.src = s;
    document.head.insertBefore(z, document.getElementsByTagName("script")[0]);
  })(
    "cwr",
    "7d252e98-751c-4f6e-bd3b-db31710a500b",
    "1.0.0",
    "us-east-1",
    "https://client.rum.us-east-1.amazonaws.com/1.0.2/cwr.js",
    {
      sessionSampleRate: 1,
      guestRoleArn:
        "arn:aws:iam::217392961699:role/RUM-Monitor-us-east-1-217392961699-9516319672461-Unauth",
      identityPoolId: "us-east-1:515e393e-caf5-4584-8617-21a001273b7b",
      endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
      telemetries: ["performance", "errors", "http"],
      allowCookies: true,
      enableXRay: true,
    }
  )`,
  stg: `(function (n, i, v, r, s, c, x, z) {
    x = window.AwsRumClient = { q: [], n: n, i: i, v: v, r: r, c: c };
    window[n] = function (c, p) {
      x.q.push({ c: c, p: p });
    };
    z = document.createElement("script");
    z.async = true;
    z.src = s;
    document.head.insertBefore(z, document.getElementsByTagName("script")[0]);
  })(
    "cwr",
    "b4a22c15-ffb8-4094-94d4-9c06a0b5ba9d",
    "1.0.0",
    "us-east-1",
    "https://client.rum.us-east-1.amazonaws.com/1.0.2/cwr.js",
    {
      sessionSampleRate: 1,
      guestRoleArn:
        "arn:aws:iam::982780673531:role/RUM-Monitor-us-east-1-982780673531-4801996872461-Unauth",
      identityPoolId: "us-east-1:b0946aa6-eecc-4015-a49d-d923368961fd",
      endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
      telemetries: ["performance", "errors", "http"],
      allowCookies: true,
      enableXRay: true,
    }
  )`,
  prod: `(function (n, i, v, r, s, c, x, z) {
    x = window.AwsRumClient = { q: [], n: n, i: i, v: v, r: r, c: c };
    window[n] = function (c, p) {
      x.q.push({ c: c, p: p });
    };
    z = document.createElement("script");
    z.async = true;
    z.src = s;
    document.head.insertBefore(z, document.getElementsByTagName("script")[0]);
  })(
    "cwr",
    "aa182474-d174-4d6b-9924-cbab60e1868c",
    "1.0.0",
    "us-east-1",
    "https://client.rum.us-east-1.amazonaws.com/1.0.2/cwr.js",
    {
      sessionSampleRate: 1,
      guestRoleArn:
        "arn:aws:iam::862176787939:role/RUM-Monitor-us-east-1-862176787939-4924627872461-Unauth",
      identityPoolId: "us-east-1:af2a86ec-7b7a-445c-9d41-19c5aa24b118",
      endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
      telemetries: ["performance", "errors", "http"],
      allowCookies: true,
      enableXRay: true,
    }
  )`,
};
