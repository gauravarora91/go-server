import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Feed } from '.'

const app = () => express(routes)

let userSession, anotherSession, feed

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  feed = await Feed.create({ user })
})

test('POST /feeds 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, type: 'test', url: 'test', category: 'test', text: 'test', image: 'test', slug: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.type).toEqual('test')
  expect(body.url).toEqual('test')
  expect(body.category).toEqual('test')
  expect(body.text).toEqual('test')
  expect(body.image).toEqual('test')
  expect(body.slug).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /feeds 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /feeds 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /feeds/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${feed.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(feed.id)
})

test('GET /feeds/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /feeds/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${feed.id}`)
    .send({ access_token: userSession, type: 'test', url: 'test', category: 'test', text: 'test', image: 'test', slug: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(feed.id)
  expect(body.type).toEqual('test')
  expect(body.url).toEqual('test')
  expect(body.category).toEqual('test')
  expect(body.text).toEqual('test')
  expect(body.image).toEqual('test')
  expect(body.slug).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /feeds/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${feed.id}`)
    .send({ access_token: anotherSession, type: 'test', url: 'test', category: 'test', text: 'test', image: 'test', slug: 'test' })
  expect(status).toBe(401)
})

test('PUT /feeds/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${feed.id}`)
  expect(status).toBe(401)
})

test('PUT /feeds/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, type: 'test', url: 'test', category: 'test', text: 'test', image: 'test', slug: 'test' })
  expect(status).toBe(404)
})

test('DELETE /feeds/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${feed.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /feeds/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${feed.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /feeds/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${feed.id}`)
  expect(status).toBe(401)
})

test('DELETE /feeds/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
