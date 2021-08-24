process.env.NODE_ENV = 'test'
const request = require('supertest')
const app = require('../app')
const items = require('../fakeDb')

let chocolate = {
    name: 'chocolate',
    price: 5
}

beforeEach(() => {
  items.push(chocolate)
})
afterEach(() => {
  items.length = 0
})

describe("/GET /items", () => {
  test("Get shoping list", async () => {
    const res = await request(app).get('/items')

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({items: [chocolate]})
  })
})

describe("/POST /items", () => {
  test("Create an item", async () => {
    const res = await request(app)
      .post('/items')
      .send({name: 'eggs', price: 4})

    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({item: {name: 'eggs', price: 4}})
  })
  test("Responds with 400 if required info is missing", async () => {
    const res = await request(app).post('/items').send({price: 5})

    expect(res.statusCode).toBe(400)
  })
})

describe("/GET /items/:name", () => {
  test("Get a single item", async () => {
    const res = await request(app).get(`/items/${chocolate.name}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({item: chocolate})
  })
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).get('/items/ereyr5f5rr5gyyr5g5r')

    expect(res.statusCode).toBe(404)
  })
})

describe("/PATCH /items/:name", () => {
  test("Update an item", async () => {
    const res = await request(app)
      .patch(`/items/${chocolate.name}`)
      .send({name: "milkChocolate"})

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({updated: {name: "milkChocolate", price: 5}})
  })
  test("Responds with 404 for updating invalid item", async () => {
    const res = await request(app)
    .patch('/items/th4w656rtrfqdfgfgfgfgfgfgfgfg')
    .send({name: "milkChocolate"})

    expect(res.statusCode).toBe(404)
  })
})

describe("/DELETE /items/:name", () => {
  test("Delete an item", async () => {
    const res = await request(app).delete(`/items/${chocolate.name}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ msg: 'Deleted' })
  })
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete('/items/hyet656hrtb')

    expect(res.statusCode).toBe(404)
  })
})