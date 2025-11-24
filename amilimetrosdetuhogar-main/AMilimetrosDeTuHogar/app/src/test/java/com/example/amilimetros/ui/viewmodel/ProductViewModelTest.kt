package com.example.amilimetros.ui.viewmodel

import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import com.example.amilimetros.data.remote.dto.ProductoDto
import com.example.amilimetros.data.repository.ProductoApiRepository
import io.mockk.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class ProductViewModelTest {

    @get:Rule
    val instantExecutorRule = InstantTaskExecutorRule()

    private val testDispatcher = StandardTestDispatcher()

    private lateinit var viewModel: ProductViewModel
    private lateinit var repository: ProductoApiRepository

    private val sampleProductos = listOf(
        ProductoDto(1, "Collar", "Collar para perros", 1500.0, "Accesorios", null),
        ProductoDto(2, "Alimento Premium", "Alimento para gatos", 5000.0, "Alimentos", null),
        ProductoDto(3, "Juguete", "Pelota de goma", 800.0, "Juguetes", null)
    )

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        repository = mockk()

        // Mock inicial para que init funcione
        coEvery { repository.getProductos() } returns Result.success(sampleProductos)

        viewModel = ProductViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
        clearAllMocks()
    }

    @Test
    fun `init debe cargar productos automaticamente`() = runTest {
        // Given - ya se ejecutó en setup

        // Then
        assertEquals(sampleProductos, viewModel.productos.value)
        assertEquals(false, viewModel.isLoading.value)
        assertNull(viewModel.error.value)

        coVerify { repository.getProductos() }
    }

    @Test
    fun `cargarProductos exitoso debe actualizar lista`() = runTest {
        // Given
        val nuevosProductos = listOf(
            ProductoDto(4, "Nuevo Producto", "Descripción", 2000.0, "Accesorios", null)
        )
        coEvery { repository.getProductos() } returns Result.success(nuevosProductos)

        // When
        viewModel.cargarProductos()
        testDispatcher.scheduler.advanceUntilIdle()

        // Then
        assertEquals(nuevosProductos, viewModel.productos.value)
        assertEquals(false, viewModel.isLoading.value)
        assertNull(viewModel.error.value)
    }

    @Test
    fun `cargarProductos fallido debe mostrar error`() = runTest {
        // Given
        val errorMessage = "Error de conexión"
        coEvery { repository.getProductos() } returns Result.failure(Exception(errorMessage))

        // When
        viewModel.cargarProductos()
        testDispatcher.scheduler.advanceUntilIdle()

        // Then
        assertTrue(viewModel.error.value?.contains("Error al cargar productos") == true)
        assertEquals(false, viewModel.isLoading.value)
    }


    @Test
    fun `buscarProductos debe filtrar por nombre correctamente`() = runTest {
        // Given - productos ya cargados desde setup
        val query = "Collar"

        // When
        viewModel.buscarProductos(query)
        testDispatcher.scheduler.advanceUntilIdle()

        // Then
        assertEquals(1, viewModel.productos.value.size)
        assertEquals("Collar", viewModel.productos.value[0].nombre)
    }

    @Test
    fun `buscarProductos debe ser case insensitive`() = runTest {
        // Given
        val query = "ALIMENTO"

        // When
        viewModel.buscarProductos(query)
        testDispatcher.scheduler.advanceUntilIdle()

        // Then
        assertEquals(1, viewModel.productos.value.size)
        assertTrue(viewModel.productos.value[0].nombre.contains("Alimento", ignoreCase = true))
    }

    @Test
    fun `buscarProductos con query vacio debe mostrar todos`() = runTest {
        // Given
        val query = ""

        // When
        viewModel.buscarProductos(query)
        testDispatcher.scheduler.advanceUntilIdle()

        // Then
        assertEquals(sampleProductos.size, viewModel.productos.value.size)
    }

    @Test
    fun `buscarProductos sin coincidencias debe retornar lista vacia`() = runTest {
        // Given
        val query = "NoExiste"

        // When
        viewModel.buscarProductos(query)
        testDispatcher.scheduler.advanceUntilIdle()

        // Then
        assertTrue(viewModel.productos.value.isEmpty())
    }

    @Test
    fun `clearError debe limpiar el mensaje de error`() = runTest {
        // Given - generar un error
        coEvery { repository.getProductos() } returns Result.failure(Exception("Error"))
        viewModel.cargarProductos()
        testDispatcher.scheduler.advanceUntilIdle()

        // Verificar que hay error
        assertTrue(viewModel.error.value != null)

        // When
        viewModel.clearError()

        // Then
        assertNull(viewModel.error.value)
    }

    @Test
    fun `cargarProductos con excepcion debe capturar el error`() = runTest {
        // Given
        val exceptionMessage = "Network timeout"
        coEvery { repository.getProductos() } throws Exception(exceptionMessage)

        // When
        viewModel.cargarProductos()
        testDispatcher.scheduler.advanceUntilIdle()

        // Then
        assertTrue(viewModel.error.value?.contains(exceptionMessage) == true)
    }


}