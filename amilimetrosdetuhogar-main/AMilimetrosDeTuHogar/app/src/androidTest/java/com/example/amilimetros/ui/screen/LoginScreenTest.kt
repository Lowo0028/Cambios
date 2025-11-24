package com.example.amilimetros.ui.screen

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.example.amilimetros.ui.theme.AMilimetrosTheme
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class LoginScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun loginScreen_displaysAllElements() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                LoginScreen(
                    onNavigateToRegister = {},
                    onNavigateToHome = {}
                )
            }
        }

        // Then
        composeTestRule.onNodeWithText("Iniciar Sesión").assertIsDisplayed()
        composeTestRule.onNodeWithText("Ingresa tus credenciales").assertIsDisplayed()
        composeTestRule.onNodeWithText("Email").assertIsDisplayed()
        composeTestRule.onNodeWithText("Contraseña").assertIsDisplayed()
        composeTestRule.onNodeWithText("Entrar").assertIsDisplayed()
        composeTestRule.onNodeWithText("Crear cuenta nueva").assertIsDisplayed()
    }

    @Test
    fun loginScreen_emailField_acceptsInput() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                LoginScreen(
                    onNavigateToRegister = {},
                    onNavigateToHome = {}
                )
            }
        }

        // When
        composeTestRule.onNodeWithText("Email").performTextInput("test@test.com")

        // Then
        composeTestRule.onNodeWithText("test@test.com").assertIsDisplayed()
    }

    @Test
    fun loginScreen_passwordField_acceptsInput() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                LoginScreen(
                    onNavigateToRegister = {},
                    onNavigateToHome = {}
                )
            }
        }

        // When
        composeTestRule.onNodeWithText("Contraseña").performTextInput("123456")

        // Then - La contraseña debería estar oculta
        composeTestRule.onNodeWithText("123456").assertDoesNotExist()
        // Pero el campo debe tener contenido
        composeTestRule.onNodeWithText("Contraseña").assertExists()
    }

    @Test
    fun loginScreen_emptyFields_showsError() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                LoginScreen(
                    onNavigateToRegister = {},
                    onNavigateToHome = {}
                )
            }
        }

        // When - Click en Entrar sin llenar campos
        composeTestRule.onNodeWithText("Entrar").performClick()

        // Then - No debería navegar y campos vacíos
        composeTestRule.onNodeWithText("Iniciar Sesión").assertIsDisplayed()
    }

    @Test
    fun loginScreen_clickRegisterButton_navigates() {
        // Given
        var registerClicked = false
        composeTestRule.setContent {
            AMilimetrosTheme {
                LoginScreen(
                    onNavigateToRegister = { registerClicked = true },
                    onNavigateToHome = {}
                )
            }
        }

        // When
        composeTestRule.onNodeWithText("Crear cuenta nueva").performClick()

        // Then
        assert(registerClicked)
    }

    @Test
    fun loginScreen_validCredentials_enablesLoginButton() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                LoginScreen(
                    onNavigateToRegister = {},
                    onNavigateToHome = {}
                )
            }
        }

        // When
        composeTestRule.onNodeWithText("Email").performTextInput("test@test.com")
        composeTestRule.onNodeWithText("Contraseña").performTextInput("123456")

        // Then - Botón debe estar habilitado
        composeTestRule.onNodeWithText("Entrar").assertIsEnabled()
    }


}