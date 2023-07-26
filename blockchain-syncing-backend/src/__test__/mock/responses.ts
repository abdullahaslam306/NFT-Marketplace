export const responses = {
    mockEncryptedPassword : 'cR4OIaNmzg0/QRTKnGfNPPHLOVZyr1nf6XzYD329uX46J36x0NWKiOUzeuEnn15/1kbjW9CIF9mlcwt4V52IZC7l+90AWoQj+Or7fQriLo+qbXhqMCvCeUVL0Zsl2d1LqByos9uvkZAPJlfzwrTW8nrrpFrs2Zzd+OROmVfwGd062+rtxNRbNSjkRbY9/ZE7ZcYOTZ0s3uIVnIvBghoiDFLTX9x3aMXW3pQ6uFZ29i7Knt8IwbT8mhQaHjaJUxY9ngHI0eQkchloZYgAbt9r4ehaPl7DQZY8NI8Fnutn95Fv42ZaDtFOYH83x8isbZZg/liwkid9ZIMZJ8B8cRT2kg==',
    verifyPhone : {
        cognitoGetUserInvalidPhoneNumber : {
         'UserAttributes' : [ 
      { 
        'Name':'phone_number',
        'Value':'+923136643155' // invalid phone this will not match user's phone number stored in database.
      }],

       },
        cognitoGetUserPhoneAlreadyVerified : {
         'UserAttributes' : [ 
      { 
        'Name':'phone_number',
        'Value':'+923136643154' // invalid phone this will not match user's phone number stored in database.
      }],

       },
        cognitoGetUserSucceValidPhoneNumber: {
         'UserAttributes' : [ 
      { 
        'Name':'phone_number',
        'Value':'+923136643156' // invalid phone this will not match user's phone number stored in database.
      }],

       }
    },
    getInfo : {
        getInfoSuccessResponse :  {
            type: 'Merchants',
            id: '6b325edd-62d3-4b4c-a2e0-6e1e5d00699e',
            attributes: { sid: '6b325edd-62d3-4b4c-a2e0-6e1e5d00699e' }
    },
    },
 STS : {
       mockCredentials : {
        AccessKeyId: 'valid-key-id',
        SecretAccessKey: 'valid-secret-access-key',
        SessionToken: 'valid-session-token',
        Expiration: 'valid-expiration',
      },
    },
  SM : {
    getSecretsMockResposne : {
      
      privateKey : `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAnK6Nhtv0kZDSXMmk+W+JyWfCC01XdDiImrHbAnUsql6O0Njg
4kNZuqEqj82v2YybNFVUTveLcpau8Kj+fK1OZ+lZA5+hm75ogBxtiU4ebWLvAyW8
HPtdKkGMCw+v3riVrpalDc5gqZmud1yiRqNZZmlkLWkaEvHoeBmSoef9VNMzFiSi
yELrHxR/FuhKXGl3N0I0LJV1Kl4e5esVxNuOxzYduY+449PjSEskoPrvjJ5yy2T1
jeOd/uq8XcpBYjb+wlAfFWstAa3BmsA9J06cE2TA98CMEgm+CjDijQM1RHPtQuwr
qKvh5kjqJtcXo7/+xVCnDFaEcTAVVk3SnRtHdQIDAQABAoIBACuMuPnLGWd8gXwY
8CoEvp+kn2LU1IIRVKbq2J0ORKP2NGwIXDmHzuD4+wONgFtPobQiI5TvaWsoRufN
kS7GXQy053ECZcEMY694N1n6xKpS3WxaiLblhze/kFVivteBJtmoNahovKVnef7j
WJeZv7efg6C7neu2IY+ATCmEef2hZyWAg9kMr/KtrNY1M461stxTm1+BrMQjW9uG
YmwtP07/oo+Cql2WntAtc/kbVBYk6vFT/nlhFBnwJymxu/J31NSdvQ8x1oiNWknb
B8FI1S6i6NdyL0nMbzvKimu6feEOc6H4HX6KlocGOB6B2YFOU1OviIR1zNHBd3j+
acrjv+ECgYEAzr9cZA3TUsftfdvZpQVgkLgX4VgjbE0bfi1SBtlJVrX3ThcWj5lX
aa3yx2feEcO83ce1zgUf2kQkaS+7kflqCFV0A3JdjmAoHLqS3IO4rQS6pjtLRviW
lsQTFZqiDrvsXbJq66DWO7EOgceNYVSpNFUBXqlY8ZfuwHC5q7bgG4MCgYEAwgHn
QaEhx8tTFWnMg1Thhz3A3qW3dJoGtBMSSQKC4TZ5XU6HMEIKTE+h8lLeZT2RZ7r1
M0OD0/1FzbN/XzBO8KD9lpCEmeAXFjcChQFXyEbgo8Dppr5xVw2KNPe0/+uhd0Yj
Ct7ozaXQn9h1VZNysTn3arvVMZqoEvqh8QcYR6cCgYB8UbVMtMON04qLU9fb0w/t
9cTmTAmA5hzSEo5wb9gZu/Gpk1iNoLdfZKnIHjz6kajP83bvG0W8CZ2bYoh3jnKj
8D6ClBKNumRkYgxNbSdvYpiZvK3XT0O+BMk1BHbORVIsRUzlwyEPY7hFcakiDbZx
MWxRb6N8Is/+B8qd5ql74QKBgA5Lj5uxYMjU/Yk9Y3ll3rxVW4nMUilAVDAem6FP
kw8/MVAjwihXJWUcFQXC/2ocUEOBbiHZ3rPXHLacfE0qRRbL9gOLIIoqDelwIjpk
r/As8M6AH3dO3xEYCU//1JFq7lnYjCp35FWK20V78KFenPvcFpQBxSLDj5DecOJO
sIZPAoGAJ3fDEwlll5QNj8AF1HV6TGMD1Ispw1NDZipW9d2vHTqi4HR/+G44y4xo
SNaZhaZrRgNs9zpJGDnQvx7l5Hh1Tp161DAz4SShsVqbQLMcVZQeNhiBAHMETbc4
GMjnm62myLLlEP33bbW6WaIlLxZgeaiaN9rKOvvrpddewoMIrtM=
-----END RSA PRIVATE KEY-----`
    }
  },
  lambda: {
    lazyMintMockLambdaResponse: {
      Payload: `{  
      "userId" : 1,
      "tokenId": 1,
      "signature" :"THIS IS SIGNATURE"}`
    }
  }

}
