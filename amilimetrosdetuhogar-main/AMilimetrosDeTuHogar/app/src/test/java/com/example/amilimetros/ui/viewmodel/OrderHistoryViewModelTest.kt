package com.example.amilimetros.ui.viewmodel

import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import com.example.amilimetros.data.local.storage.UserPreferences
import com.example.amilimetros.data.remote.dto.ItemOrdenDto
import com.example.amilimetros.data.remote.dto.OrdenDto
import com.example.amilimetros.data.repository.OrdenApiRepository
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
class OrderHistoryViewModelTest {

    @get:Rule
    val instantExecutorRule = InstantTaskExecutorRule()

    private val testDispatcher = StandardTestDispatcher()

    private lateinit var viewModel: OrderHistoryViewModel
    private lateinit var userPreferences: UserPreferences
    private lateinit var ordenRepository: OrdenApiRepository

    private val sampleOrden = OrdenDto(
        id = 1,
        usuarioId = 1L,
        total = 5000.0,
        createdAt = "2024-01-15T10:30:00",
        status = "PENDIENTE"
    )

    private val sampleItems = listOf(
        ItemOrdenDto(1, 1, 1, "Producto 1", 1000.0, 2, null),
        ItemOrdenDto(2, 1, 2, "Producto 2", 1500.0, 2, null)
    )

    private fun advanceUntilIdle() = testDispatcher.scheduler.advanceUntilIdle()

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        userPreferences = mockk()
        ordenRepository = mockk()

        coEvery { userPreferences.getUserId() } returns 1L
        coEvery { ordenRepository.obtenerOrdenesPorUsuario(1L) } returns
                Result.success(listOf(sampleOrden))
        coEvery { ordenRepository.obtenerItemsDeOrden(1L) } returns
                Result.success(sampleItems)

        viewModel = OrderHistoryViewModel(userPreferences, ordenRepository)
        advanceUntilIdle()
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
        clearAllMocks()
    }

    @Test
    fun `init debe cargar historial automaticamente`() = runTest {
        // Then
        assertEquals(1, viewModel.orders.value.size)
        assertEquals(false, viewModel.isLoading.value)
        assertNull(viewModel.errorMessage.value)

        coVerify { ordenRepository.obtenerOrdenesPorUsuario(1L) }
    }

    @Test
    fun `loadOrderHistory exitoso debe actualizar ordenes`() = runTest {
        // Given
        val nuevaOrden = OrdenDto(2, 1L, 3000.0, "2024-01-16T11:00:00", "ENTREGADO")
        coEvery { ordenRepository.obtenerOrdenesPorUsuario(1L) } returns
                Result.success(listOf(sampleOrden, nuevaOrden))
        coEvery { ordenRepository.obtenerItemsDeOrden(2L) } returns
                Result.success(emptyList())

        // When
        viewModel.loadOrderHistory()
        advanceUntilIdle()

        // Then
        assertEquals(2, viewModel.orders.value.size)
        assertEquals(false, viewModel.isLoading.value)
    }

    @Test
    fun `loadOrderHistory sin usuario debe mostrar error`() = runTest {
        // Given
        coEvery { userPreferences.getUserId() } returns null
        val newViewModel = OrderHistoryViewModel(userPreferences, ordenRepository)

        // When
        newViewModel.loadOrderHistory()
        advanceUntilIdle()

        // Then
        assertEquals("Usuario no autenticado", newViewModel.errorMessage.value)
        assertTrue(newViewModel.orders.value.isEmpty())
    }

    @Test
    fun `loadOrderHistory fallido debe mostrar error`() = runTest {
        // Given
        val errorMessage = "Error al cargar historial"
        coEvery { ordenRepository.obtenerOrdenesPorUsuario(1L) } returns
                Result.failure(Exception(errorMessage))

        // When
        viewModel.loadOrderHistory()
        advanceUntilIdle()

        // Then
        assertEquals(errorMessage, viewModel.errorMessage.value)
    }

    @Test
    fun `loadOrderHistory debe cargar items de cada orden`() = runTest {
        // Given - ya configurado en setup

        // When
        viewModel.loadOrderHistory()
        advanceUntilIdle()

        // Then
        val orden = viewModel.orders.value.first()
        assertEquals(sampleItems.size, orden.items.size)

        coVerify { ordenRepository.obtenerItemsDeOrden(sampleOrden.id) }
    }

    @Test
    fun `loadOrderHistory con error en items debe continuar`() = runTest {
        // Given
        coEvery { ordenRepository.obtenerItemsDeOrden(1L) } returns
                Result.failure(Exception("Error items"))

        // When
        viewModel.loadOrderHistory()
        advanceUntilIdle()

        // Then
        val orden = viewModel.orders.value.first()
        assertTrue(orden.items.isEmpty())
    }

    @Test
    fun `formatearFecha debe convertir ISO a formato legible`() = runTest {
        // Given - fecha ya formateada en setup

        // When
        viewModel.loadOrderHistory()
        advanceUntilIdle()

        // Then
        val orden = viewModel.orders.value.first()
        // Verificar que la fecha está formateada (formato dd/MM/yyyy HH:mm)
        assertTrue(orden.fecha.contains("/"))
    }

    @Test
    fun `clearError debe limpiar mensaje de error`() = runTest {
        // Given - generar error
        coEvery { ordenRepository.obtenerOrdenesPorUsuario(1L) } returns
                Result.failure(Exception("Error"))
        viewModel.loadOrderHistory()
        advanceUntilIdle()

        // When
        viewModel.clearError()

        // Then
        assertNull(viewModel.errorMessage.value)
    }

    @Test
    fun `loadOrderHistory con multiples ordenes debe procesarlas todas`() = runTest {
        // Given
        val ordenes = listOf(
            OrdenDto(1, 1L, 1000.0, "2024-01-01T10:00:00", "PENDIENTE"),
            OrdenDto(2, 1L, 2000.0, "2024-01-02T10:00:00", "ENTREGADO"),
            OrdenDto(3, 1L, 3000.0, "2024-01-03T10:00:00", "EN_PROCESO")
        )

        coEvery { ordenRepository.obtenerOrdenesPorUsuario(1L) } returns
                Result.success(ordenes)
        ordenes.forEach { orden ->
            coEvery { ordenRepository.obtenerItemsDeOrden(orden.id) } returns
                    Result.success(emptyList())
        }

        // When
        viewModel.loadOrderHistory()
        advanceUntilIdle()

        // Then
        assertEquals(3, viewModel.orders.value.size)
        assertEquals("PENDIENTE", viewModel.orders.value[0].estado)
        assertEquals("ENTREGADO", viewModel.orders.value[1].estado)
        assertEquals("EN_PROCESO", viewModel.orders.value[2].estado)
    }


}