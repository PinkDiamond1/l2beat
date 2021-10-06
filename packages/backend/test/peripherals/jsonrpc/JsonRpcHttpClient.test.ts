import { expect } from 'chai'
import { Response } from 'node-fetch'

import { HttpClient } from '../../../src/peripherals/HttpClient'
import {
  JsonRpcError,
  JsonRpcHttpClient,
} from '../../../src/peripherals/jsonrpc'
import { Logger } from '../../../src/tools/Logger'

describe('JsonRpcHttpClient', () => {
  it('correctly sets up a request', async () => {
    const httpClient = new HttpClient()
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    httpClient.fetch = async (url, init) => {
      expect(url).to.equal('https://jsonrpc.test.url')
      expect(init?.method).to.equal('POST')
      expect(init?.headers).to.deep.equal({
        'Content-Type': 'application/json',
      })
      return new Response(
        JSON.stringify({ jsonrpc: '2.0', id: 1337, result: 'ok' })
      )
    }
    await client.call('foo')
  })

  it('correctly handles the response', async () => {
    const httpClient = new HttpClient()
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    httpClient.fetch = async () =>
      new Response(JSON.stringify({ jsonrpc: '2.0', id: 1337, result: 'ok' }))
    const result = await client.call('foo')
    expect(result).to.equal('ok')
  })

  it('throws for non-json response', async () => {
    const httpClient = new HttpClient()
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    httpClient.fetch = async () => new Response('blah')
    await expect(client.call('foo')).to.be.rejectedWith(
      TypeError,
      'Invalid JSON-RPC response'
    )
  })

  it('throws for non-2XX response', async () => {
    const httpClient = new HttpClient()
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    httpClient.fetch = async () => new Response('foobar', { status: 400 })
    await expect(client.call('foo')).to.be.rejectedWith(
      Error,
      'Http error 400: foobar'
    )
  })

  it('throws JsonRpcError for JSON-RPC error response', async () => {
    const httpClient = new HttpClient()
    const client = new JsonRpcHttpClient(
      'https://jsonrpc.test.url',
      httpClient,
      Logger.SILENT
    )
    httpClient.fetch = async () =>
      new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: 1337,
          error: {
            code: 1234,
            message: 'boo',
          },
        }),
        { status: 400 }
      )
    await expect(client.call('foo')).to.be.rejectedWith(JsonRpcError)
  })
})