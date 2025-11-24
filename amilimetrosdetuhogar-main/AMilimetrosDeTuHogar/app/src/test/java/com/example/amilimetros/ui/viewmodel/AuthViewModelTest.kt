package com.example.amilimetros.ui.viewmodel

import androidx.arch.core.executor.testing.InstantTaskExecutorRule
import com.example.amilimetros.data.local.storage.UserPreferences
import com.example.amilimetros.data.remote.dto.LoginRequest
import com.example.amilimetros.data.remote.dto.RegisterRequest
import com.example.amilimetros.data.remote.dto.UsuarioResponse
import com.example.amilimetros.data.repository.AuthApiRepository
import io.mockk.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.delay

@OptIn(ExperimentalCoroutinesApi::class)
class AuthViewModelTest {

    @get:Rule
    val instantExecutorRule = InstantTaskExecutorRule()

    private val testDispatcher = StandardTestDispatcher()

    private lateinit var viewModel: AuthViewModel
    private lateinit var repository: AuthApiRepository
    private lateinit var userPreferences: UserPreferences

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        repository = mockk()
        userPreferences = mockk(relaxed = true)

        // Mock inicial de UserPreferences
        coEvery { userPreferences.getUserId() } returns null
        coEvery { userPreferences.getEmail() } returns null
        coEvery { userPreferences.getNombre() } returns null
        coEvery { userPreferences.getIsAdmin() } returns false

        viewModel = AuthViewModel(repository, userPreferences)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
        clearAllMocks()
    }

    @Test
    fun `login exitoso debe actualizar estado a Success`() = runTest {
        // Given
        val email = "test@example.com"
        val password = "password123"
        val usuario = UsuarioResponse(1, "Test User", email, "123456789", false)

        coEvery { repository.login(any()) } returns Result.success(usuario)
        coEvery { userPreferences.saveUser(any(), any(), any(), any(), any()) } just Runs

        // When
        viewModel.login(email, password)
        testDispatcher.scheduler.advanceUntilIdle()

        // Then
        val state = viewModel.loginState.value
        assertTrue(state is LoginState.Success)
        assertEquals(usuario, (state as LoginState.Success).user)

        coVerify {
            repository.login(LoginRequest(email, password))
            userPreferences.saveUser(
                userId = usuario.id,
                email = usuario.email,
                nombre = usuario.nombre,
                telefono = usuario.telefono,
                isAdmin = usuario.isAdmin
            )
        }
    }

    @Test
    fun `login fallido debe actualizar estado a Error`() = runTest {
        // Given
        val email = "test@example.com"
        val password = "wrongpassword"
        val errorMessage = "Credenciales incorrectas"

        coEvery { repository.login(any()) } returns Result.failure(Exception(errorMessage))

        // When
        viewModel.login(email, password)
        advanceUntilIdle()

        // Then
        val state = viewModel.loginState.value
        assertTrue(state is LoginState.Error)
        assertEquals(errorMessage, (state as LoginState.Error).message)
    }



    @Test
    fun `register exitoso debe actualizar estado a Success`() = runTest {
        // Given
        val nombre = "Test User"
        val email = "test@example.com"
        val telefono = "123456789"
        val password = "password123"

        val usuario = UsuarioResponse(1, nombre, email, telefono, false)
        coEvery { repository.register(any()) } returns Result.success(usuario)

        // When
        viewModel.register(nombre, email, telefono, password)
        advanceUntilIdle()

        // Then
        assertEquals(RegisterState.Success, viewModel.registerState.value)

        coVerify {
            repository.register(RegisterRequest(nombre, email, telefono, password))
        }
    }

    @Test
    fun `register fallido debe actualizar estado a Error`() = runTest {
        // Given
        val errorMessage = "Email ya registrado"
        coEvery { repository.register(any()) } returns Result.failure(Exception(errorMessage))

        // When
        viewModel.register("Test", "test@example.com", "123", "pass")
        advanceUntilIdle()

        // Then
        val state = viewModel.registerState.value
        assertTrue(state is RegisterState.Error)
        assertEquals(errorMessage, (state as RegisterState.Error).message)
    }

    @Test
    fun `logout debe limpiar datos del usuario`() = runTest {
        // Given
        coEvery { userPreferences.clearUser() } just Runs

        // When
        viewModel.logout()
        advanceUntilIdle()

        // Then
        coVerify { userPreferences.clearUser() }
        assertEquals(null, viewModel.currentUser.value)
        assertEquals(LoginState.Idle, viewModel.loginState.value)
    }

    @Test
    fun `resetStates debe resetear todos los estados`() = runTest {
        // Given - establecer estados no-idle
        coEvery { repository.login(any()) } returns
                Result.failure(Exception("Error"))
        viewModel.login("test@test.com", "pass")
        advanceUntilIdle()

        // When
        viewModel.resetStates()

        // Then
        assertEquals(LoginState.Idle, viewModel.loginState.value)
        assertEquals(RegisterState.Idle, viewModel.registerState.value)
    }

    @Test
    fun `checkSession debe cargar usuario si existe sesion`() = runTest {
        // Given
        val userId = 1L
        val email = "test@example.com"
        val nombre = "Test User"
        val telefono = "123456789"
        val isAdmin = true

        coEvery { userPreferences.getUserId() } returns userId
        coEvery { userPreferences.getEmail() } returns email
        coEvery { userPreferences.getNombre() } returns nombre
        coEvery { userPreferences.getTelefono() } returns telefono
        coEvery { userPreferences.getIsAdmin() } returns isAdmin

        // When - crear nuevo ViewModel para activar checkSession en init
        val newViewModel = AuthViewModel(repository, userPreferences)
        advanceUntilIdle()

        // Then
        val currentUser = newViewModel.currentUser.value
        assertEquals(userId, currentUser?.id)
        assertEquals(email, currentUser?.email)
        assertEquals(nombre, currentUser?.nombre)
        assertEquals(isAdmin, currentUser?.isAdmin)
    }
}