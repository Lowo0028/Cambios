package com.example.amilimetros.data.repository

import com.example.amilimetros.data.remote.ApiService
import com.example.amilimetros.data.remote.dto.*
import io.mockk.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.delay
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
class AuthApiRepositoryTest {

    private lateinit var repository: AuthApiRepository
    private lateinit var mockApi: ApiService

    @Before
    fun setup() {
        mockApi = mockk()

        // Mockear ApiService.createAuthService()
        mockkObject(ApiService.Companion)
        every { ApiService.createAuthService() } returns mockApi

        repository = AuthApiRepository()
    }

    @After
    fun tearDown() {
        clearAllMocks()
        unmockkAll()
    }

    @Test
    fun `login exitoso debe retornar usuario`() = runTest {
        // Given
        val email = "test@example.com"
        val password = "password123"
        val loginRequest = LoginRequest(email, password)
        val loginResponse = LoginResponse(success = true, message = "Login exitoso")
        val usuario = UsuarioResponse(1, "Test User", email, "123456789", false)

        coEvery { mockApi.login(loginRequest) } returns Response.success(loginResponse)
        coEvery { mockApi.buscarUsuarioPorCorreo(email) } returns Response.success(usuario)

        // When
        val result = repository.login(loginRequest)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(usuario, result.getOrNull())

        coVerify {
            mockApi.login(loginRequest)
            mockApi.buscarUsuarioPorCorreo(email)
        }
    }

    @Test
    fun `login con credenciales incorrectas debe retornar error`() = runTest {
        // Given
        val loginRequest = LoginRequest("test@test.com", "wrong")
        val loginResponse = LoginResponse(success = false, message = "Credenciales incorrectas")

        coEvery { mockApi.login(loginRequest) } returns Response.success(loginResponse)

        // When
        val result = repository.login(loginRequest)

        // Then
        assertTrue(result.isFailure)
        assertEquals("Credenciales incorrectas", result.exceptionOrNull()?.message)
    }

    @Test
    fun `login exitoso pero error al obtener usuario debe retornar error`() = runTest {
        // Given
        val loginRequest = LoginRequest("test@test.com", "pass")
        val loginResponse = LoginResponse(success = true, message = "OK")

        coEvery { mockApi.login(loginRequest) } returns Response.success(loginResponse)
        coEvery { mockApi.buscarUsuarioPorCorreo(any()) } returns Response.error(
            404,
            "Not found".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.login(loginRequest)

        // Then
        assertTrue(result.isFailure)
        assertEquals("Error al obtener datos del usuario", result.exceptionOrNull()?.message)
    }

    @Test
    fun `login con respuesta no exitosa debe retornar error`() = runTest {
        // Given
        val loginRequest = LoginRequest("test@test.com", "pass")

        coEvery { mockApi.login(loginRequest) } returns Response.error(
            401,
            "Unauthorized".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.login(loginRequest)

        // Then
        assertTrue(result.isFailure)
    }

    @Test
    fun `login con excepcion debe capturar error`() = runTest {
        // Given
        val loginRequest = LoginRequest("test@test.com", "pass")
        val exceptionMessage = "Network error"

        coEvery { mockApi.login(loginRequest) } throws Exception(exceptionMessage)

        // When
        val result = repository.login(loginRequest)

        // Then
        assertTrue(result.isFailure)
        assertEquals(exceptionMessage, result.exceptionOrNull()?.message)
    }

    @Test
    fun `register exitoso debe retornar usuario`() = runTest {
        // Given
        val registerRequest = RegisterRequest(
            nombre = "New User",
            email = "new@test.com",
            telefono = "987654321",
            contrasena = "password"
        )
        val usuario = UsuarioResponse(1, "New User", "new@test.com", "987654321", false)

        coEvery { mockApi.register(registerRequest) } returns Response.success(usuario)

        // When
        val result = repository.register(registerRequest)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(usuario, result.getOrNull())
    }

    @Test
    fun `register fallido debe retornar error`() = runTest {
        // Given
        val registerRequest = RegisterRequest("Test", "test@test.com", "123", "pass")

        coEvery { mockApi.register(registerRequest) } returns Response.error(
            400,
            "Email already exists".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.register(registerRequest)

        // Then
        assertTrue(result.isFailure)
    }

    @Test
    fun `buscarPorCorreo exitoso debe retornar usuario`() = runTest {
        // Given
        val email = "test@test.com"
        val usuario = UsuarioResponse(1, "Test", email, "123", false)

        coEvery { mockApi.buscarUsuarioPorCorreo(email) } returns Response.success(usuario)

        // When
        val result = repository.buscarPorCorreo(email)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(usuario, result.getOrNull())
    }

    @Test
    fun `buscarPorCorreo no encontrado debe retornar error`() = runTest {
        // Given
        val email = "notfound@test.com"

        coEvery { mockApi.buscarUsuarioPorCorreo(email) } returns Response.error(
            404,
            "Not found".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.buscarPorCorreo(email)

        // Then
        assertTrue(result.isFailure)
        assertEquals("Usuario no encontrado", result.exceptionOrNull()?.message)
    }

    @Test
    fun `buscarPorId exitoso debe retornar usuario`() = runTest {
        // Given
        val userId = 1L
        val usuario = UsuarioResponse(userId, "Test", "test@test.com", "123", false)

        coEvery { mockApi.buscarUsuarioPorId(userId) } returns Response.success(usuario)

        // When
        val result = repository.buscarPorId(userId)

        // Then
        assertTrue(result.isSuccess)
        assertEquals(usuario, result.getOrNull())
    }

    @Test
    fun `buscarPorId no encontrado debe retornar error`() = runTest {
        // Given
        val userId = 999L

        coEvery { mockApi.buscarUsuarioPorId(userId) } returns Response.error(
            404,
            "Not found".toResponseBody("text/plain".toMediaTypeOrNull())
        )

        // When
        val result = repository.buscarPorId(userId)

        // Then
        assertTrue(result.isFailure)
        assertEquals("Usuario no encontrado", result.exceptionOrNull()?.message)
    }
}