package com.example.amilimetros.data.repository

import com.example.amilimetros.data.remote.ApiService
import com.example.amilimetros.data.remote.dto.AddToCartRequest
import com.example.amilimetros.data.remote.dto.CarritoItemDto
import io.mockk.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.ResponseBody.Companion.toResponseBody
import org.junit.After
import org.junit.Before
import org.junit.Test
import retrofit2.Response
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class CarritoApiRepositoryTest {

    private lateinit var repository: CarritoApiRepository
    private lateinit var mockApi: ApiService

    private val sampleItem = CarritoItemDto(
        id = 1,
        usuarioId = 1L,
        productoId = 1L,
        productoNombre = "Producto Test",
        productoPrecio = 1000.0,
        cantidad = 2,
        imageUrl = null
    )

    @Before
    fun setup() {
        mockApi = mockk()

        mockkObject(ApiService.Companion)
        every { ApiService.createCarritoService() } returns mockApi

        repository = CarritoApiRepository()
    }

    @After
    fun tearDown() {
        clearAllMocks()
        unmockkAll()
    }

    @Test
    fun `obtenerCarrito exitoso debe retornar lista de items`() = runTest {
        // Given
        val usuarioId = 1L
        val items = listOf(sampleItem)

        coEvery { mockApi.obtenerCarrito(usuarioId) } returns Response.success(items)

        // When
        val result = repository.obtenerCarrito(usuarioId)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(items, result.getOrNull())
    }

    @Test
    fun `obtenerCarrito vacio debe retornar lista vacia`() = runTest {
        // Given
        val usuarioId = 1L

        coEvery { mockApi.obtenerCarrito(usuarioId) } returns Response.success(emptyList())

        // When
        val result = repository.obtenerCarrito(usuarioId)

        // Then
        assertTrue(result.isSuccess)
        assertTrue(result.getOrNull()?.isEmpty() == true)
    }

    @Test
    fun `obtenerCarrito fallido debe retornar error`() = runTest {
        // Given
        val usuarioId = 1L

        coEvery { mockApi.obtenerCarrito(usuarioId) } returns Response.error(
            500,
            "Server error".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.obtenerCarrito(usuarioId)

        // Then
        assertTrue(result.isFailure)
    }

    @Test
    fun `agregarAlCarrito exitoso debe retornar item`() = runTest {
        // Given
        val request = AddToCartRequest(1L, 1L, 2)

        coEvery { mockApi.agregarAlCarrito(request) } returns Response.success(sampleItem)

        // When
        val result = repository.agregarAlCarrito(request)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(sampleItem, result.getOrNull())
    }

    @Test
    fun `agregarAlCarrito fallido debe retornar error`() = runTest {
        // Given
        val request = AddToCartRequest(1L, 1L, 1)

        coEvery { mockApi.agregarAlCarrito(request) } returns Response.error(
            400,
            "Bad request".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.agregarAlCarrito(request)

        // Then
        assertTrue(result.isFailure)
    }

    @Test
    fun `actualizarCantidad exitoso debe retornar item actualizado`() = runTest {
        // Given
        val itemId = 1L
        val cantidad = 5
        val itemActualizado = sampleItem.copy(cantidad = cantidad)

        coEvery { mockApi.actualizarCantidadItem(itemId, mapOf("cantidad" to cantidad)) } returns
                Response.success(itemActualizado)

        // When
        val result = repository.actualizarCantidad(itemId, cantidad)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(cantidad, result.getOrNull()?.cantidad)
    }

    @Test
    fun `actualizarCantidad fallido debe retornar error`() = runTest {
        // Given
        val itemId = 1L
        val cantidad = 0

        coEvery { mockApi.actualizarCantidadItem(itemId, any()) } returns Response.error(
            400,
            "Invalid quantity".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.actualizarCantidad(itemId, cantidad)

        // Then
        assertTrue(result.isFailure)
    }

    @Test
    fun `eliminarItem exitoso debe retornar success`() = runTest {
        // Given
        val itemId = 1L

        coEvery { mockApi.eliminarItemCarrito(itemId) } returns Response.success(Unit)

        // When
        val result = repository.eliminarItem(itemId)

        // Then
        assertTrue(result.isSuccess)
    }

    @Test
    fun `eliminarItem fallido debe retornar error`() = runTest {
        // Given
        val itemId = 999L

        coEvery { mockApi.eliminarItemCarrito(itemId) } returns Response.error(
            404,
            "Not found".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.eliminarItem(itemId)

        // Then
        assertTrue(result.isFailure)
    }

    @Test
    fun `vaciarCarrito exitoso debe retornar success`() = runTest {
        // Given
        val usuarioId = 1L

        coEvery { mockApi.vaciarCarrito(usuarioId) } returns Response.success(Unit)

        // When
        val result = repository.vaciarCarrito(usuarioId)

        // Then
        assertTrue(result.isSuccess)
    }

    @Test
    fun `vaciarCarrito fallido debe retornar error`() = runTest {
        // Given
        val usuarioId = 1L

        coEvery { mockApi.vaciarCarrito(usuarioId) } returns Response.error(
            500,
            "Server error".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.vaciarCarrito(usuarioId)

        // Then
        assertTrue(result.isFailure)
    }

    @Test
    fun `calcularTotal exitoso debe retornar total`() = runTest {
        // Given
        val usuarioId = 1L
        val total = 5000.0
        val response = mapOf("total" to total)

        coEvery { mockApi.calcularTotalCarrito(usuarioId) } returns Response.success(response)

        // When
        val result = repository.calcularTotal(usuarioId)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(total, result.getOrNull())
    }

    @Test
    fun `calcularTotal sin items debe retornar cero`() = runTest {
        // Given
        val usuarioId = 1L
        val response = mapOf("total" to 0.0)

        coEvery { mockApi.calcularTotalCarrito(usuarioId) } returns Response.success(response)

        // When
        val result = repository.calcularTotal(usuarioId)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(0.0, result.getOrNull())
    }

    @Test
    fun `calcularTotal fallido debe retornar error`() = runTest {
        // Given
        val usuarioId = 1L

        coEvery { mockApi.calcularTotalCarrito(usuarioId) } returns Response.error(
            500,
            "Server error".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.calcularTotal(usuarioId)

        // Then
        assertTrue(result.isFailure)
    }

    @Test
    fun `operaciones con excepcion deben capturar error`() = runTest {
        // Given
        val usuarioId = 1L
        val exceptionMessage = "Network timeout"

        coEvery { mockApi.obtenerCarrito(usuarioId) } throws Exception(exceptionMessage)

        // When
        val result = repository.obtenerCarrito(usuarioId)

        // Then
        assertTrue(result.isFailure)
        assertEquals(exceptionMessage, result.exceptionOrNull()?.message)
    }
}