package com.example.amilimetros.ui.viewmodel

import com.example.amilimetros.data.remote.dto.AnimalDto
import com.example.amilimetros.data.repository.AnimalApiRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.MockitoAnnotations
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue


@ExperimentalCoroutinesApi
class AnimalViewModelTest {

    @Mock
    private lateinit var repository: AnimalApiRepository

    private lateinit var viewModel: AnimalViewModel
    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        Dispatchers.setMain(testDispatcher)
        viewModel = AnimalViewModel(repository)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `cargarAnimalesDisponibles exitoso debe cargar lista`() = runTest {
        // Arrange
        val mockAnimales = listOf(
            AnimalDto(1L, "Max", "Perro", "Labrador", "3 años", "Amigable", false, null),
            AnimalDto(2L, "Luna", "Gato", "Siamés", "2 años", "Tranquila", false, null)
        )
        `when`(repository.obtenerDisponibles()).thenReturn(Result.success(mockAnimales))

        // Act
        viewModel.cargarAnimalesDisponibles()
        advanceUntilIdle()

        // Assert
        assertEquals(2, viewModel.animales.value.size)
        assertEquals("Max", viewModel.animales.value[0].nombre)
        assertFalse(viewModel.isLoading.value)
        verify(repository).obtenerDisponibles()
    }

    @Test
    fun `cargarAnimalesDisponibles con error debe actualizar estado`() = runTest {
        // Arrange
        val errorMsg = "Error de conexión"
        `when`(repository.obtenerDisponibles()).thenReturn(Result.failure(Exception(errorMsg)))

        // Act
        viewModel.cargarAnimalesDisponibles()
        advanceUntilIdle()

        // Assert
        assertEquals(errorMsg, viewModel.error.value)
        assertTrue(viewModel.animales.value.isEmpty())
    }

    @Test
    fun `loadAnimalById exitoso debe cargar animal seleccionado`() = runTest {
        // Arrange
        val animalId = 1L
        val mockAnimal = AnimalDto(animalId, "Max", "Perro", "Labrador", "3 años", "Amigable", false, null)
        `when`(repository.obtenerPorId(animalId)).thenReturn(Result.success(mockAnimal))

        // Act
        viewModel.loadAnimalById(animalId)
        advanceUntilIdle()

        // Assert
        assertEquals(mockAnimal, viewModel.selectedAnimal.value)
        verify(repository).obtenerPorId(animalId)
    }

    @Test
    fun `buscarAnimales debe filtrar correctamente`() = runTest {
        // Arrange
        val query = "Max"
        val mockAnimales = listOf(
            AnimalDto(1L, "Max", "Perro", "Labrador", "3 años", "Amigable", false, null)
        )
        `when`(repository.buscarPorNombre(query)).thenReturn(Result.success(mockAnimales))

        // Act
        viewModel.buscarAnimales(query)
        advanceUntilIdle()

        // Assert
        assertEquals(1, viewModel.animales.value.size)
        assertEquals("Max", viewModel.animales.value[0].nombre)
    }

    @Test
    fun `filtrarPorEspecie debe filtrar por especie`() = runTest {
        // Arrange
        val especie = "Perro"
        val mockAnimales = listOf(
            AnimalDto(1L, "Max", "Perro", "Labrador", "3 años", "Amigable", false, null),
            AnimalDto(2L, "Rocky", "Perro", "Beagle", "4 años", "Juguetón", false, null)
        )
        `when`(repository.obtenerPorEspecie(especie)).thenReturn(Result.success(mockAnimales))

        // Act
        viewModel.filtrarPorEspecie(especie)
        advanceUntilIdle()

        // Assert
        assertEquals(2, viewModel.animales.value.size)
        assertTrue(viewModel.animales.value.all { it.especie == especie })
    }
}