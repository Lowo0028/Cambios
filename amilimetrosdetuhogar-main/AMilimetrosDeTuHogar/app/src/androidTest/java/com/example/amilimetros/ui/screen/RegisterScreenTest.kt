package com.example.amilimetros.ui.screen

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.example.amilimetros.ui.theme.AMilimetrosTheme
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class RegisterScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun registerScreen_displaysAllElements() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                RegisterScreen(
                    onNavigateToLogin = {},
                    onNavigateBack = {}
                )
            }
        }

        // Then
        composeTestRule.onNodeWithText("Crear Cuenta").assertIsDisplayed()
        composeTestRule.onNodeWithText("Completa tus datos para registrarte").assertIsDisplayed()
        composeTestRule.onNodeWithText("Nombre completo").assertIsDisplayed()
        composeTestRule.onNodeWithText("Email").assertIsDisplayed()
        composeTestRule.onNodeWithText("Teléfono").assertIsDisplayed()
        composeTestRule.onNodeWithText("Contraseña").assertIsDisplayed()
        composeTestRule.onNodeWithText("Confirmar contraseña").assertIsDisplayed()
        composeTestRule.onNodeWithText("Registrar").assertIsDisplayed()
        composeTestRule.onNodeWithText("Ya tengo cuenta").assertIsDisplayed()
    }

    @Test
    fun registerScreen_allFields_acceptInput() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                RegisterScreen(
                    onNavigateToLogin = {},
                    onNavigateBack = {}
                )
            }
        }

        // When
        composeTestRule.onNodeWithText("Nombre completo").performTextInput("Juan Pérez")
        composeTestRule.onNodeWithText("Email").performTextInput("juan@test.com")
        composeTestRule.onNodeWithText("Teléfono").performTextInput("912345678")
        composeTestRule.onNodeWithText("Contraseña").performTextInput("Pass123!")
        composeTestRule.onNodeWithText("Confirmar contraseña").performTextInput("Pass123!")

        // Then
        composeTestRule.onNodeWithText("Juan Pérez").assertIsDisplayed()
        composeTestRule.onNodeWithText("juan@test.com").assertIsDisplayed()
        composeTestRule.onNodeWithText("912345678").assertIsDisplayed()
    }

    @Test
    fun registerScreen_emptyFields_showsErrors() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                RegisterScreen(
                    onNavigateToLogin = {},
                    onNavigateBack = {}
                )
            }
        }

        // When - Intentar registrar sin llenar campos
        composeTestRule.onNodeWithText("Registrar").performClick()

        // Then - Debe permanecer en la pantalla de registro
        composeTestRule.onNodeWithText("Crear Cuenta").assertIsDisplayed()
    }

    @Test
    fun registerScreen_shortPassword_showsError() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                RegisterScreen(
                    onNavigateToLogin = {},
                    onNavigateBack = {}
                )
            }
        }

        // When
        composeTestRule.onNodeWithText("Nombre completo").performTextInput("Juan Pérez")
        composeTestRule.onNodeWithText("Email").performTextInput("juan@test.com")
        composeTestRule.onNodeWithText("Teléfono").performTextInput("912345678")
        composeTestRule.onNodeWithText("Contraseña").performTextInput("123")
        composeTestRule.onNodeWithText("Confirmar contraseña").performTextInput("123")
        composeTestRule.onNodeWithText("Registrar").performClick()

        // Then - Debería mostrar error
        composeTestRule.onNodeWithText("Mínimo 6 caracteres").assertIsDisplayed()
    }

    @Test
    fun registerScreen_passwordMismatch_showsError() {
        // Given
        composeTestRule.setContent {
            AMilimetrosTheme {
                RegisterScreen(
                    onNavigateToLogin = {},
                    onNavigateBack = {}
                )
            }
        }

        // When
        composeTestRule.onNodeWithText("Nombre completo").performTextInput("Juan Pérez")
        composeTestRule.onNodeWithText("Email").performTextInput("juan@test.com")
        composeTestRule.onNodeWithText("Teléfono").performTextInput("912345678")
        composeTestRule.onNodeWithText("Contraseña").performTextInput("Pass123!")
        composeTestRule.onNodeWithText("Confirmar contraseña").performTextInput("Pass456!")
        composeTestRule.onNodeWithText("Registrar").performClick()

        // Then
        composeTestRule.onNodeWithText("Las contraseñas no coinciden").assertIsDisplayed()
    }

    @Test
    fun registerScreen_clickLoginButton_navigates() {
        // Given
        var loginClicked = false
        composeTestRule.setContent {
            AMilimetrosTheme {
                RegisterScreen(
                    onNavigateToLogin = { loginClicked = true },
                    onNavigateBack = {}
                )
            }
        }

        // When
        composeTestRule.onNodeWithText("Ya tengo cuenta").performClick()

        // Then
        assert(loginClicked)
    }
}