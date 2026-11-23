const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// POST - Crear un producto nuevo
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body || {}

    // Los tres campos son obligatorios. El precio 0 no se considera ausente.
    if (!nombre || !descripcion || precio === undefined || precio === null || precio === '') {
        return res.status(400).json({ mensaje: 'Nombre, descripcion y precio son obligatorios' })
    }

    const precioNumerico = parseFloat(precio)
    if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un numero mayor que cero' })
    }

    // Se toma el ID mayor para evitar repetir IDs cuando se eliminan productos.
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1
    const nuevoProducto = { id: nuevoId, nombre, descripcion, precio: precioNumerico }

    productos.push(nuevoProducto)
    return res.status(201).json(nuevoProducto)
})

// PUT - Actualizar todos los datos de un producto existente
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const posicion = productos.findIndex(p => p.id === id)

    if (posicion === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const { nombre, descripcion, precio } = req.body || {}
    if (!nombre || !descripcion || precio === undefined || precio === null || precio === '') {
        return res.status(400).json({ mensaje: 'Nombre, descripcion y precio son obligatorios' })
    }

    const precioNumerico = parseFloat(precio)
    if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un numero mayor que cero' })
    }

    const productoActualizado = { id, nombre, descripcion, precio: precioNumerico }
    productos[posicion] = productoActualizado

    return res.status(200).json(productoActualizado)
})

// DELETE - Eliminar un producto por su ID
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const posicion = productos.findIndex(p => p.id === id)

    if (posicion === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // splice devuelve un arreglo; [0] obtiene el producto eliminado.
    const productoEliminado = productos.splice(posicion, 1)[0]
    return res.status(200).json({ mensaje: 'Producto eliminado', producto: productoEliminado })
})

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
