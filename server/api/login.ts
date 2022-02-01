import type {IncomingMessage, ServerResponse} from 'http'
import {generateKeyPair, SignJWT} from "jose"

export default async (req: IncomingMessage, res: ServerResponse) => {
    const {publicKey, privateKey} = await generateKeyPair('ES512')
    const signed = await new SignJWT({payload: {foo: 'bar'}})
        .setProtectedHeader({alg: 'ES512'})
        .setIssuedAt()
        .setIssuer('urn:example:issuer')
        .setAudience('urn:example:audience')
        .setExpirationTime('8h')
        .sign(privateKey)
    res.end(signed)
}