package com.example.amilimetros.data.remote.dto

import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class DTOsTest {

    @Test
    fun `LoginRequest debe crear correctamente`() {
        // When
        val request = LoginRequest("test@example.com", "password123")

        // Then
        assertEquals("test@example.com", request.email)
        assertEquals("password123", request.contrasena)
    }

    @Test
    fun `RegisterRequest debe crear correctamente`() {
        // When
        val request = RegisterRequest(
            nombre = "Test User",
            email = "test@test.com",
            telefono = "123456789",
            contrasena = "password"
        )

        // Then
        assertEquals("Test User", request.nombre)
        assertEquals("test@test.com", request.email)
        assertEquals("123456789", request.telefono)
        assertEquals("password", request.contrasena)
    }

    @Test
    fun `UsuarioResponse debe crear correctamente`() {
        // When
        val usuario = UsuarioResponse(
            id = 1,
            nombre = "Test",
            email = "test@test.com",
            telefono = "123",
            isAdmin = true
        )

        // Then
        assertEquals(1, usuario.id)
        assertEquals("Test", usuario.nombre)
        assertTrue(usuario.isAdmin)
    }

    @Test
    fun `ProductoDto debe crear correctamente con imagen null`() {
        // When
        val producto = ProductoDto(
            id = 1,
            nombre = "Collar",
            descripcion = "Collar para perros",
            precio = 1500.0,
            categoria = "Accesorios",
            imagen = null
        )

        // Then
        assertEquals(1, producto.id)
        assertEquals("Collar", producto.nombre)
        assertEquals(1500.0, producto.precio)
        assertEquals(null, producto.imagen)
    }

    @Test
    fun `ProductoDto debe crear correctamente con imagen`() {
        // When
        val producto = ProductoDto(
            id = 1,
            nombre = "Collar",
            descripcion = "Collar para perros",
            precio = 1500.0,
            categoria = "Accesorios",
            imagen = "base64string"
        )

        // Then
        assertNotNull(producto.imagen)
        assertEquals("base64string", producto.imagen)
    }

    @Test
    fun `AnimalDto debe crear correctamente`() {
        // When
        val animal = AnimalDto(
            id = 1,
            nombre = "Luna",
            especie = "Perro",
            raza = "Labrador",
            edad = "2 años",
            descripcion = "Muy juguetona",
            isAdoptado = false,
            imagen = null
        )

        // Then
        assertEquals(1, animal.id)
        assertEquals("Luna", animal.nombre)
        assertEquals("Perro", animal.especie)
        assertFalse(animal.isAdoptado)
    }

    @Test
    fun `AnimalDto debe reflejar estado adoptado`() {
        // When
        val animal = AnimalDto(
            id = 1,
            nombre = "Max",
            especie = "Gato",
            raza = "Siamés",
            edad = "1 año",
            descripcion = "Tranquilo",
            isAdoptado = true,
            imagen = null
        )

        // Then
        assertTrue(animal.isAdoptado)
    }

    @Test
    fun `CarritoItemDto debe crear correctamente`() {
        // When
        val item = CarritoItemDto(
            id = 1,
            usuarioId = 1L,
            productoId = 1L,
            productoNombre = "Alimento",
            productoPrecio = 5000.0,
            cantidad = 2,
            imageUrl = null
        )

        // Then
        assertEquals(1, item.id)
        assertEquals(1L, item.usuarioId)
        assertEquals(2, item.cantidad)
        assertEquals(5000.0, item.productoPrecio)
    }

    @Test
    fun `CarritoItemDto debe permitir id null`() {
        // When
        val item = CarritoItemDto(
            id = null,
            usuarioId = 1L,
            productoId = 1L,
            productoNombre = "Alimento",
            productoPrecio = 5000.0,
            cantidad = 1,
            imageUrl = null
        )

        // Then
        assertEquals(null, item.id)
    }

    @Test
    fun `AddToCartRequest debe crear correctamente con cantidad default`() {
        // When
        val request = AddToCartRequest(
            usuarioId = 1L,
            productoId = 1L
        )

        // Then
        assertEquals(1L, request.usuarioId)
        assertEquals(1L, request.productoId)
        assertEquals(1, request.cantidad)
    }

    @Test
    fun `AddToCartRequest debe crear con cantidad personalizada`() {
        // When
        val request = AddToCartRequest(
            usuarioId = 1L,
            productoId = 1L,
            cantidad = 5
        )

        // Then
        assertEquals(5, request.cantidad)
    }

    @Test
    fun `FormularioAdopcionDto debe crear correctamente`() {
        // When
        val formulario = FormularioAdopcionDto(
            id = 1,
            usuarioId = 1L,
            animalId = 1L,
            direccion = "Calle Test 123",
            tipoVivienda = "Casa",
            tieneMallasVentanas = true,
            viveEnDepartamento = false,
            tieneOtrosAnimales = false,
            motivoAdopcion = "Quiero adoptar",
            estado = "PENDIENTE",
            comentariosAdmin = null,
            fechaCreacion = "2024-01-01",
            fechaRevision = null
        )

        // Then
        assertEquals("PENDIENTE", formulario.estado)
        assertEquals("Casa", formulario.tipoVivienda)
        assertTrue(formulario.tieneMallasVentanas)
        assertFalse(formulario.viveEnDepartamento)
    }

    @Test
    fun `FormularioAdopcionDto debe tener estado PENDIENTE por default`() {
        // When
        val formulario = FormularioAdopcionDto(
            id = null,
            usuarioId = 1L,
            animalId = 1L,
            direccion = "Test",
            tipoVivienda = "Casa",
            tieneMallasVentanas = true,
            viveEnDepartamento = false,
            tieneOtrosAnimales = false,
            motivoAdopcion = "Test"
        )

        // Then
        assertEquals("PENDIENTE", formulario.estado)
    }

    @Test
    fun `OrdenDto debe crear correctamente`() {
        // When
        val orden = OrdenDto(
            id = 1,
            usuarioId = 1L,
            total = 5000.0,
            createdAt = "2024-01-01T10:00:00",
            status = "PENDIENTE"
        )

        // Then
        assertEquals(1, orden.id)
        assertEquals(5000.0, orden.total)
        assertEquals("PENDIENTE", orden.status)
    }

    @Test
    fun `ItemOrdenDto debe crear correctamente`() {
        // When
        val item = ItemOrdenDto(
            id = 1,
            ordenId = 1,
            productoId = 1,
            productoNombre = "Producto Test",
            productoPrecio = 1000.0,
            cantidad = 2,
            imageUrl = null
        )

        // Then
        assertEquals(1, item.id)
        assertEquals(1, item.ordenId)
        assertEquals(2, item.cantidad)
    }

    @Test
    fun `CrearOrdenRequest debe crear correctamente`() {
        // Given
        val items = listOf(
            ItemOrdenRequest(1, "Producto 1", 1000.0, 2, null),
            ItemOrdenRequest(2, "Producto 2", 1500.0, 1, null)
        )

        // When
        val request = CrearOrdenRequest(
            usuarioId = 1L,
            total = 3500.0,
            items = items
        )

        // Then
        assertEquals(1L, request.usuarioId)
        assertEquals(3500.0, request.total)
        assertEquals(2, request.items.size)
    }

    @Test
    fun `LoginResponse debe crear correctamente`() {
        // When
        val response = LoginResponse(
            success = true,
            message = "Login exitoso"
        )

        // Then
        assertTrue(response.success)
        assertEquals("Login exitoso", response.message)
    }

    @Test
    fun `LoginResponse debe manejar fallo`() {
        // When
        val response = LoginResponse(
            success = false,
            message = "Credenciales incorrectas"
        )

        // Then
        assertFalse(response.success)
        assertEquals("Credenciales incorrectas", response.message)
    }

    @Test
    fun `DetallesOrdenDto debe crear correctamente`() {
        // Given
        val orden = OrdenDto(1, 1L, 3000.0, "2024-01-01", "PENDIENTE")
        val items = listOf(
            ItemOrdenDto(1, 1, 1, "Producto", 1000.0, 3, null)
        )

        // When
        val detalles = DetallesOrdenDto(
            orden = orden,
            items = items,
            cantidadItems = 3
        )

        // Then
        assertEquals(orden, detalles.orden)
        assertEquals(1, detalles.items.size)
        assertEquals(3, detalles.cantidadItems)
    }
}