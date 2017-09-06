import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Event } from '.'

const app = () => express(routes)

let userSession, adminSession, event

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  event = await Event.create({})
})

test('POST /events 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: adminSession, name: 'test', descriptionShort: 'test', descriptionLong: 'test', pledgedAmount: 'test', images: 'test', time: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.descriptionShort).toEqual('test')
  expect(body.descriptionLong).toEqual('test')
  expect(body.pledgedAmount).toEqual('test')
  expect(body.images).toEqual('test')
  expect(body.time).toEqual('test')
})

test('POST /events 401 (user)', async () => {
  const { status } = await request(app())
    .post('/')
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /events 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /events 200', async () => {
  const { status, body } = await request(app())
    .get('/')
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /events/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`/${event.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(event.id)
})

test('GET /events/:id 404', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /events/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`/${event.id}`)
    .send({ name: 'test', descriptionShort: 'test', descriptionLong: 'test', pledgedAmount: 'test', images: 'test', time: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(event.id)
  expect(body.name).toEqual('test')
  expect(body.descriptionShort).toEqual('test')
  expect(body.descriptionLong).toEqual('test')
  expect(body.pledgedAmount).toEqual('test')
  expect(body.images).toEqual('test')
  expect(body.time).toEqual('test')
})

test('PUT /events/:id 404', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ name: 'test', descriptionShort: 'test', descriptionLong: 'test', pledgedAmount: 'test', images: 'test', time: 'test' })
  expect(status).toBe(404)
})

test('DELETE /events/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`/${event.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /events/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${event.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /events/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${event.id}`)
  expect(status).toBe(401)
})

test('DELETE /events/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
